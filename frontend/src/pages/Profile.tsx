
import { useQuery } from '@tanstack/react-query';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FeedItem from '../components/feed/FeedItem';       
import ProjectItem from '../components/projects/ProjectItem'; 
import PromptCard from '../components/marketplace/PromptCard'; 
import { posts, users, Post } from '../data/dummyData';
import {findUser,
  getCurrentUser,
  User,
  updateUser,
  getNetworkedUsers,
  getNetworkingUsers,
  updateUserAvatar
} from '../apis/user-apis'
import { getPromptsByCreator, Prompt, dummyPrompts } from '../data/dummyPrompts';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';       
import { Input } from '../components/ui/input';         
import { Textarea } from '../components/ui/textarea';   
import {
  Dialog,         
  DialogContent,  
  DialogHeader,   
  DialogTitle,   
  DialogFooter,   
  DialogDescription 
} from "@/components/ui/dialog"; 
import {
  Table,         
  TableBody,      
  TableCell,      
  TableHead,     
  TableHeader,   
  TableRow,      
} from "@/components/ui/table";  
import { Edit, Trash2, Users, Camera, Save, X, Check } from 'lucide-react';


const Profile = () => {
  
  const {
    data: currentUser,
    isLoading: isLoadingCurrentUser,
    error: currentUserError,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });



  const [user,setUser]=useState<User>(null)
  const [networkedUsers,setNetworkedUsers]=useState([])
  const [networkingUsers,setNetworkingUsers]=useState([])
  
  const { userId } = useParams(); 

  //? UseEffect logic
  useEffect(()=>{

    const fetchData = async ()=>{
      try{
        if(userId){
          console.log('hello')
          const userProfile = await findUser(userId)
          setUser(userProfile)

          const networkedUsers_ = await getNetworkedUsers(userProfile.id)
          setNetworkedUsers(networkedUsers_)

          const networkingUsers_ = await getNetworkingUsers(userProfile.id)
          setNetworkingUsers(networkingUsers_)
        }
        else if (!isLoadingCurrentUser && currentUser) { // Check if not loading AND currentUser exists
          // getting networked and networking users of the currentloggedin User
          const networkedUsers_ = await getNetworkedUsers(currentUser.id);
          setNetworkedUsers(networkedUsers_);
  
          const networkingUsers_ = await getNetworkingUsers(currentUser.id);
          setNetworkingUsers(networkingUsers_);
        }

      }
      catch(error){
        console.log('error fetching data for currently logged in user or fetching request user')
      }
    }
    fetchData()
    
  },[userId,isLoadingCurrentUser, currentUser])

  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'marketplace'>('posts');
  const [displayCount, setDisplayCount] = useState(5);
  const [showNetworkDialog, setShowNetworkDialog] = useState<'followers' | 'following' | null>(null);

  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedBio, setEditedBio] = useState('');

  const [showUsernameError, setShowUsernameError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if(isLoadingCurrentUser) return <></>
  if(!currentUser) return <></>
  if(!user && userId) return <></>
  




  const profileUser = userId?user:currentUser
  const isCurrentUser = profileUser.id === currentUser.id;

  const userPosts = posts.filter(post => post.userId === profileUser.id);
 
  const filteredPosts = userPosts.filter(post =>
    activeTab === 'posts' ? !post.isProject : (activeTab === 'projects' ? post.isProject : false)
  );
 
  const userPrompts = getPromptsByCreator(profileUser.id);
  
  const displayItems = activeTab === 'marketplace'
    ? userPrompts.slice(0, displayCount) 
    : filteredPosts.slice(0, displayCount); 
 
  const hasMore = activeTab === 'marketplace'
    ? displayCount < userPrompts.length 
    : displayCount < filteredPosts.length;
  

  
  const handleNetworkToggle = () => {
    if (profileUser) {
      toast.info(`Removed ${profileUser.username} from your network`);
      // TODO: Update the dummy data (e.g., profileUser.isFollowing = false; profileUser.followers--;). This needs care as it might not persist correctly without proper state management or re-fetching.
    } else {
     
      // TODO: Update dummy data (e.g., profileUser.isFollowing = true; profileUser.followers++;).
    }
  };

 
  const handleTabChange = (tab: 'posts' | 'projects' | 'marketplace') => {
    setActiveTab(tab); 
    setDisplayCount(5); 
  };

  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5); 
  };


  const handlePostUpdated = () => {
    setDisplayCount(displayCount);
  };

  
  const getNetworkedUsers_ = ()=> {
    
    return networkedUsers.slice(0,8)
   
  };

 
  const getNetworkingUsers_ = ()=> {
   
    return networkingUsers.slice(0,8)
  
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
      setEditedFirstName(profileUser.firstName);
      setEditedLastName(profileUser.lastName)
      setEditedUsername(profileUser.username);
      setEditedBio(profileUser.bio);
      setIsEditing(true); 
    }
  };

  
  const saveProfileChanges = async () => {
    
    if (!editedFirstName.trim()) { 
      toast.error("firstName cannot be empty"); 
      return; 
    }
    if (!editedLastName.trim()) { 
      toast.error("lastName cannot be empty"); 
      return; 
    }

    if(!editedUsername.trim()){
      toast.error("Username cannot be empty")
      return;
    }

    const update_data = {
      firstName:editedFirstName,
      lastName:editedLastName,
      username:editedUsername,
      bio:editedBio
    }

    try {
      const updated_user_from_server = await updateUser(update_data);
      if (updated_user_from_server.code==200) {
        profileUser.firstName = updated_user_from_server.data.firstName, // Assuming the server returns the updated user
        profileUser.lastName = updated_user_from_server.data.lastName,
        profileUser.username = updated_user_from_server.data.username,
        profileUser.bio = updated_user_from_server.data.bio,
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
      else throw new Error(updated_user_from_server.message)
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; 
    const reader = new FileReader(); 
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try{
          const response = await updateUserAvatar(reader.result)
          console.log('image change resp',response)
          if(response.code == 200){
            profileUser.avatarUrl = response.data.avatarUrl
            toast.success("Profile picture updated");
            setDisplayCount(displayCount);
          }
         else throw new Error(response.message)
        }
        catch(error)
        {
          toast.error(error)
        }
      }
    };
    reader.readAsDataURL(file); 
  };



 
  const renderMarketplaceItems = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(userPrompts.slice(0, displayCount)).map((prompt) => (
          <div key={prompt.id} className="relative"> {/* `relative` positioning context for the buttons */}
            <PromptCard prompt={prompt} />
            {isCurrentUser && (
              <div className="absolute top-3 right-3 flex space-x-1">
                <Button
                  variant="secondary" 
                  size="sm"          
                  className="h-8 w-8 p-0" 
                  onClick={() => handleEditPrompt(prompt)} 
                >
                  <Edit className="h-4 w-4" /> 
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDeletePrompt(prompt)}
                >
                  <Trash2 className="h-4 w-4" /> 
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPostItems = () => {
    return filteredPosts.slice(0, displayCount).map((post: Post) => (
      post.isProject ? ( 
        <ProjectItem key={post.id} project={post} /> 
      ) : (
        <FeedItem key={post.id} post={post} onPostUpdated={handlePostUpdated} /> 
      )
    ));
  };


  return (
    <div>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm border border-border/30 p-6 mb-6">
          <div className="flex items-start justify-between"> 

            <div className="flex items-start space-x-4"> 

              <div className="relative group"> 
                {isEditing && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={triggerFileUpload} 
                  >
                    <Camera className="w-6 h-6 text-white" /> 
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleProfilePictureChange} 
                    />
                  </div>
                )}
                <img
                  src={profileUser.avatarUrl}
                  alt={profileUser.username} 
                  className="avatar w-20 h-20" 
                />
              </div>

              <div>
                {isEditing ? (
                  <div className="space-y-3"> 
                    <div>
                      <Input
                        value={editedFirstName} 
                        onChange={(e) => setEditedFirstName(e.target.value)} 
                        className="font-bold text-xl" 
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Input
                        value={editedLastName} 
                        onChange={(e) => setEditedLastName(e.target.value)} 
                        className="font-bold text-xl" 
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1"> 
                        <span className="text-muted-foreground">@</span>
                        <Input
                          value={editedUsername}
                          onChange={(e) => {
                            setEditedUsername(e.target.value);   
                          }}
                          className=""
                          placeholder="username"
                        />
                      </div>
                      {showUsernameError && (
                        <p className="text-xs text-red-500 mt-1"> 
                          This username is already taken
                        </p>
                      )}
                    </div>
                    <div>
                      <Textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)} 
                        className="min-h-[80px]"
                        placeholder="Write a short bio about yourself"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={saveProfileChanges} disabled={showUsernameError}> 
                        <Save className="w-4 h-4 mr-1" /> 
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={toggleEditMode}> 
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <> 
                    <div className="flex items-center space-x-2"> 
                      <h1 className="text-2xl font-bold text-foreground">{`${profileUser.firstName} ${profileUser.lastName}`}</h1>
                      {isCurrentUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full" 
                          onClick={toggleEditMode} 
                        >
                          <Edit className="h-3.5 w-3.5" /> 
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground">@{profileUser.username}</p> 
                    <p className="mt-2 text-foreground max-w-lg">{profileUser.bio}</p> 
                  </>
                )}

                {!isEditing && (
                  <div className="flex items-center mt-3 space-x-4">
                    <button
                      onClick={() => setShowNetworkDialog('following')} 
                      className="hover:text-primary transition-colors" 
                    >
                      <span className="font-semibold text-foreground">{profileUser.networking}</span> 
                      <span className="ml-1 text-muted-foreground">Networking</span> 
                    </button>
                    <button
                      onClick={() => setShowNetworkDialog('followers')} 
                      className="hover:text-primary transition-colors"
                    >
                      <span className="font-semibold text-foreground">{profileUser.networked}</span> 
                      <span className="ml-1 text-muted-foreground">Networked</span> 
                    </button>
                  </div>
                )}
              </div> {/* End Text Info Block */}
            </div> {/* End Left Side Block */}
                {/*
            {!isCurrentUser && !isEditing && (
              // The button for Networking/Un-networking with the profileUser
              <button
                onClick={handleNetworkToggle} // Calls the function to toggle network status
                // Dynamic styling based on 'isFollowing' status (dummy data)
                className={`button-primary ${ // Base style class
                  profileUser.isFollowing ? 'bg-secondary text-foreground hover:bg-secondary/80' : '' // Style if following (e.g., grayed out)
                  // If not following, the default 'button-primary' style applies (likely a prominent color)
                }`}
            >*/}
                {/* Button text changes based on 'isFollowing' status */}
                {/* {profileUser.isFollowing ? 'Networked' : 'Network'} */}
              {/* </button> */}
            {/* )}  */}
          </div> {/* End Header Flex Container */}

          <div className="flex border-b border-border/30 mt-6">
            <button
              onClick={() => handleTabChange('posts')} 
              className={`pb-3 px-4 text-sm font-medium relative ${ 
                activeTab === 'posts' ? 'text-primary' : 'text-muted-foreground' 
              }`}
            >
              Posts
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" /> 
              )}
            </button>
            <button
              onClick={() => handleTabChange('projects')}
              className={`pb-3 px-4 text-sm font-medium relative ${
                activeTab === 'projects' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Projects
              {activeTab === 'projects' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('marketplace')}
              className={`pb-3 px-4 text-sm font-medium relative ${
                activeTab === 'marketplace' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Marketplace
              {activeTab === 'marketplace' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div> 
        </div> 

        <div className="space-y-4">
          {displayItems.length > 0 ? (
            activeTab === 'marketplace' ?
              renderMarketplaceItems() :
              renderPostItems()         
          ) : (
            <div className="text-center py-8"> 
              <p className="text-muted-foreground"> 
                
                {activeTab === 'marketplace'
                  ? `${profileUser.firstName} ${profileUser.lastName} hasn't created any prompts yet`
                  : `No ${activeTab} to display`}
              </p>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center my-6"> 
              <Button
                onClick={handleLoadMore} 
                variant="secondary"     
                className="w-full max-w-xs" 
              >
                Load More
              </Button>
            </div>
          )}
        </div> 
      </div> 


      <Dialog
        open={showNetworkDialog !== null} 
        onOpenChange={(isOpen) => !isOpen && setShowNetworkDialog(null)}
      >
        <DialogContent className="sm:max-w-[600px]"> 
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> 
              {showNetworkDialog === 'followers' ? 'Networked with ' : 'Networking with '}
              {profileUser.firstName + " " + profileUser.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto"> 
            <Table> 
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>  
                  <TableHead>Bio</TableHead>  
                  <TableHead></TableHead>    
                </TableRow>
              </TableHeader>
              <TableBody>
                {(showNetworkDialog === 'followers' ? getNetworkingUsers_() : getNetworkedUsers_())
                  .map((user) => (
                    <TableRow key={user.id}> 
                      <TableCell className="flex items-center space-x-3">
                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-medium">{user.firstName + " " + user.lastName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm truncate max-w-[200px]">{user.bio}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/profile/${user.id}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={promptToDelete !== null} 
        onOpenChange={(open) => !open && setPromptToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{promptToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter> 
            <Button variant="outline" onClick={() => setPromptToDelete(null)}>Cancel</Button> 
            <Button variant="destructive" onClick={confirmDeletePrompt}>Delete</Button> 
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div> 
  );
};

export default Profile;
