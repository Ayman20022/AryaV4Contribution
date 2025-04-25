import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPromptsByCreator, Prompt } from "../data/dummyPrompts";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserService } from "@/services/userService";
import { UserEssentials } from "@/types/responses/data/user/UserEssentials";
import { UserProfile } from "@/types/responses/data/user/UserProfile";
import { getCustomAvatar } from "@/lib/utils";
import { UserUpdate } from "@/types/requests/user/UserUpdate";
import { PostService } from "@/services/PostService";
import { Post } from "@/types/responses/data/post/Post";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileContentFeed from "@/components/profile/ProfileContentFeed";
import ProfileHeader from "@/components/profile/ProfileHeader";
import NetworkDialog from "@/components/profile/NetworkDialog";
import { useUserStore } from "@/store";
import { Page } from "@/types/responses/system/Page";

type Tabs = "Posts" | "Projects" | "Marketplace";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile>({} as UserProfile);
  const [networkedUsers, setNetworkedUsers] = useState<UserEssentials[]>([]);
  const [networkingUsers, setNetworkingUsers] = useState<UserEssentials[]>([]);
  const [updateProfileTrigger, setUpdateProfileTrigger] = useState(null);
  const [postPage, setpostPage] = useState<Page<Post>>();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<Tabs>("Posts");
  const [hasMore, setHasMore] = useState(false);

  const { username } = useParams();
  const navigate = useNavigate();

  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (username == "me") {
        try {
          const response = await UserService.getMe();
          setUser(response.data);

          const {
            data: { content: networkedUsers },
          } = await UserService.getNetworked(response.data.id);
          setNetworkedUsers(networkedUsers);

          const {
            data: { content: networkingUsers },
          } = await UserService.getNetworking(response.data.id);
          setNetworkingUsers(networkingUsers);
          setIsLoading(true);
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const { data: userProfile } = await UserService.getProfile(username);
          setUser(userProfile);

          const { data: { content: networkedUsers } = {} } =
            await UserService.getNetworked(userProfile.id);
          setNetworkedUsers(networkedUsers);

          const { data: { content: networkingUsers } = {} } =
            await UserService.getNetworking(userProfile.id);
          setNetworkingUsers(networkingUsers);
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [username, updateProfileTrigger]);

  useEffect(() => {
    if (user.id) {
      (async () => {
        const { data } = await PostService.findByUserId(user.id);
        setpostPage(data);
      })();
    }
  }, [user]);

  useEffect(() => {
    if (postPage) {
      const filteredPosts = postPage.content.filter((post) =>
        tab === "Posts" ? post.type === "POST" : post.type === "PROJECT"
      );
      setFilteredPosts(filteredPosts);
      setHasMore(!postPage.last);
    }
  }, [postPage, tab]);

  const [showNetworkDialog, setShowNetworkDialog] = useState<
    "followers" | "following" | null
  >(null);

  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [userUpdate, setUserUpdate] = useState<UserUpdate>({});

  const [showUsernameError, setShowUsernameError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading)
    return (
      <>
        <span className="loading loading-spinner loading-xs"></span>
      </>
    );

  const userPrompts = getPromptsByCreator(user.id);

  const handleNetworkToggle = async () => {
    if (user.isNetworking) {
      try {
        await UserService.disconnect(user.id);
        setUser((prev) => ({ ...prev, isNetworking: false }));
        toast.success(`Removed ${user.username} from your network`);
        setUpdateProfileTrigger(true);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      try {
        await UserService.connect(user.id);
        setUser((prev) => ({ ...prev, isNetworking: true }));
        toast.success(`${user.username} was added to your network`);
        setUpdateProfileTrigger(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const getNetworkedUsers_ = () => {
    return networkedUsers;
  };

  const getNetworkingUsers_ = () => {
    return networkingUsers;
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    setPromptToDelete(prompt);
  };

  const confirmDeletePrompt = () => {
    if (!promptToDelete) return;
    toast.success(`Prompt "${promptToDelete.title}" deleted`);
    setPromptToDelete(null);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setPromptToEdit(prompt);
    toast.info("Prompt editing feature will be implemented soon");
    setTimeout(() => setPromptToEdit(null), 1500);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setIsEditing(false);
      setShowUsernameError(false);
    } else {
      setUserUpdate(user);
      setIsEditing(true);
    }
  };

  const saveProfileChanges = async () => {
    try {
      const { data } = await UserService.update(userUpdate);
      setUser((prev) => ({
        ...prev,
        ...data,
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUser((prev) => ({
      ...prev,
      avatarUrl: URL.createObjectURL(file),
    }));
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm border border-border/30 p-6 mb-6">
          <ProfileHeader
            isEditing={isEditing}
            triggerFileUpload={triggerFileUpload}
            fileInputRef={fileInputRef}
            handleProfilePictureChange={handleProfilePictureChange}
            user={user}
            userUpdate={userUpdate}
            setUserUpdate={setUserUpdate}
            showUsernameError={showUsernameError}
            saveProfileChanges={saveProfileChanges}
            toggleEditMode={toggleEditMode}
            isCurrentUser={currentUser.username == username || username == "me"}
            setShowNetworkDialog={setShowNetworkDialog}
            handleNetworkToggle={handleNetworkToggle}
          />

          <ProfileTabs tab={tab} setTab={setTab} />
        </div>

        <ProfileContentFeed
          hasMore={hasMore}
          posts={filteredPosts}
          tab={tab}
          user={user}
        />
      </div>

      <NetworkDialog
        showNetworkDialog={showNetworkDialog}
        setShowNetworkDialog={setShowNetworkDialog}
        user={user}
        getNetworkedUsers_={getNetworkedUsers_}
        getNetworkingUsers_={getNetworkingUsers_}
        getCustomAvatar={getCustomAvatar}
        navigate={navigate}
      />

      <Dialog
        open={promptToDelete !== null}
        onOpenChange={(open) => !open && setPromptToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{promptToDelete?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeletePrompt}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
