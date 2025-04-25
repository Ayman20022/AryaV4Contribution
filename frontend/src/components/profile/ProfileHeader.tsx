import { getCustomAvatar } from "@/lib/utils";
import { Camera, Edit, Save, X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const ProfileHeader = ({
  isEditing,
  triggerFileUpload,
  fileInputRef,
  handleProfilePictureChange,
  user,
  userUpdate,
  setUserUpdate,
  showUsernameError,
  saveProfileChanges,
  toggleEditMode,
  isCurrentUser,
  setShowNetworkDialog,
  handleNetworkToggle,
}) => {
  return (
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
            src={
              user.avatarUrl || getCustomAvatar(user.firstName, user.lastName)
            }
            alt={user.username}
            className="avatar w-20 h-20"
          />
        </div>

        <div>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <Input
                  value={userUpdate.firstName}
                  onChange={(e) =>
                    setUserUpdate({
                      ...userUpdate,
                      firstName: e.target.value,
                    })
                  }
                  className="font-bold text-xl"
                  placeholder="Your name"
                />
              </div>
              <div>
                <Input
                  value={userUpdate.lastName}
                  onChange={(e) =>
                    setUserUpdate({
                      ...userUpdate,
                      lastName: e.target.value,
                    })
                  }
                  className="font-bold text-xl"
                  placeholder="Your name"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">@</span>
                  <Input
                    value={userUpdate.username}
                    onChange={(e) => {
                      setUserUpdate({
                        ...userUpdate,
                        username: e.target.value,
                      });
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
                  value={userUpdate.bio}
                  onChange={(e) =>
                    setUserUpdate({ ...userUpdate, bio: e.target.value })
                  }
                  className="min-h-[80px]"
                  placeholder="Write a short bio about yourself"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={saveProfileChanges}
                  disabled={showUsernameError}
                >
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
                <h1 className="text-2xl font-bold text-foreground">{`${user.firstName} ${user.lastName}`}</h1>
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
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="mt-2 text-foreground max-w-lg">{user.bio}</p>
            </>
          )}

          {!isEditing && (
            <div className="flex items-center mt-3 space-x-4">
              <button
                onClick={() => setShowNetworkDialog("following")}
                className="hover:text-primary transition-colors"
              >
                <span className="font-semibold text-foreground">
                  {user.networking}
                </span>
                <span className="ml-1 text-muted-foreground">Networking</span>
              </button>
              <button
                onClick={() => setShowNetworkDialog("followers")}
                className="hover:text-primary transition-colors"
              >
                <span className="font-semibold text-foreground">
                  {user.networked}
                </span>
                <span className="ml-1 text-muted-foreground">Networked</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {!isCurrentUser && !isEditing && (
        <button
          onClick={handleNetworkToggle}
          className={`button-primary ${
            user.isNetworking
              ? "bg-secondary text-foreground hover:bg-secondary/80"
              : ""
          }`}
        >
          {user.isNetworking ? "Networked" : "Network"}
        </button>
      )}
    </div>
  );
};

export default ProfileHeader;
