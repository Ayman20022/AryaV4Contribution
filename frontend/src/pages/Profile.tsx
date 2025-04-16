// src/pages/Profile.tsx (example path)

// --- 1. Imports ---
// These lines bring in code (functions, components, types, data) from other files or libraries.

// React core functionalities:
import React, { useState, useRef, useEffect } from 'react';
// - React: The main library for building user interfaces.
// - useState: A React Hook (special function) to add "state" (data that can change and cause the UI to update) to functional components.
// - useRef: Another React Hook to create a "ref" – a way to directly access a DOM element (like an input field) or to hold a value that doesn't cause re-renders when it changes.

// Routing functionality:
import { useParams } from 'react-router-dom';
// - useParams: A hook from the 'react-router-dom' library (used for navigating between pages in React apps). It allows you to get parameters from the URL. For example, in a URL like '/profile/user123', useParams could extract 'user123'.

// Custom components (these are likely components you or your team built):
import FeedItem from '../components/feed/FeedItem';       // Component to display a regular post.
import ProjectItem from '../components/projects/ProjectItem'; // Component to display a project update.
import PromptCard from '../components/marketplace/PromptCard'; // Component to display a marketplace prompt card.

// Dummy data and types (temporary data for development):
import { posts, users, User, Post } from '../data/dummyData';
import {findUserById, getCurrentUser} from '../apis/user-apis'
// - currentUser: An object representing the user currently logged in (dummy data).
// - findUserById: A function (from dummyData) that likely searches the 'users' array to find a user by their ID.
// - posts: An array of post objects (dummy data).
// - users: An array of user objects (dummy data).
// - User: A TypeScript "type" or "interface" describing the structure of a user object (e.g., { id: string, name: string, ... }).
// - Post: A TypeScript type describing the structure of a post object.
import { getPromptsByCreator, Prompt, dummyPrompts } from '../data/dummyPrompts';
// - getPromptsByCreator: A function (from dummyPrompts) that likely filters 'dummyPrompts' to find prompts created by a specific user ID.
// - Prompt: A TypeScript type describing the structure of a marketplace prompt object.
// - dummyPrompts: An array of prompt objects (dummy data).

// Notification library:
import { toast } from 'sonner';
// - toast: A function from the 'sonner' library used to show small, temporary pop-up notifications (like "Profile updated successfully").

// UI Components (likely from a library like Shadcn/UI):
import { Button } from '../components/ui/button';       // Reusable Button component.
import { Input } from '../components/ui/input';         // Reusable text Input field.
import { Textarea } from '../components/ui/textarea';   // Reusable multi-line Textarea field.
import {
  Dialog,         // Main component for a pop-up modal/dialog box.
  DialogContent,  // The container for the dialog's content.
  DialogHeader,   // Section for the dialog's title/header.
  DialogTitle,    // The actual title text in the header.
  DialogFooter,   // Section for buttons (like OK, Cancel) at the bottom.
  DialogDescription // Optional text to provide more context in the dialog.
} from "@/components/ui/dialog"; // Note the '@/...' path often means an alias set up in the project for easier imports.
import {
  Table,          // Main component for creating a data table.
  TableBody,      // Container for the table rows (data).
  TableCell,      // A single cell within a table row.
  TableHead,      // A single header cell in the table header row.
  TableHeader,    // Container for the table header row.
  TableRow,       // A single row within the table body or header.
} from "@/components/ui/table";  // Table-related UI components.

// Icons:
import { Edit, Trash2, Users, Camera, Save, X, Check } from 'lucide-react';
// - Imports specific icon components from the 'lucide-react' library. These are typically rendered as SVG images.

// Another dummy data function (maybe added later):
import { generateFakeUsers } from '../data/dummyData';
// - generateFakeUsers: A function to create more dummy user data if needed. Not used directly in the rendered output but potentially for the network lists.

// --- 2. Component Definition ---
// This defines the main function component for the Profile page.
const Profile = () => {
  const [currentUser,setCurrentUser]=useState(null)
  const [user,setUser]=useState(null)
  const [loading,setLoading]=useState(false)
  // Get URL parameter:
  const { userId } = useParams(); // destructing assignment: gets the 'userId' property from the object returned by useParams().
  // - If the URL is '/profile/abc', userId will be 'abc'.
  // - If the URL is just '/profile', userId will be undefined.

  //? UseEffect logic
  useEffect(()=>{

    const fetchData = async ()=>{
      setLoading(true)
      try{
        const currentUser = await getCurrentUser()
        console.log('currentUser')
        console.log(currentUser)
        setCurrentUser(currentUser)

        if(userId){
          const user_ = await findUserById(userId)
          setUser(user_)
        }
       
      }
      catch(error){
        console.log('error fetching data for currently logged in user or fetching request user')
      }
      finally{
        setLoading(false)
      }

      
    }
    console.log('we are in useEffect')
    fetchData()
    
  },[userId])

  // This is a standard way to define a functional component in React using an arrow function.

  // --- 3. Hooks and State Initialization ---

  

  // State for the active tab:
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'marketplace'>('posts');
  // - `useState` creates a state variable named `activeTab`.
  // - Its initial value is 'posts'.
  // - `setActiveTab` is the function we use to *change* the value of `activeTab`.
  // - `<'posts' | 'projects' | 'marketplace'>` is TypeScript: it tells us `activeTab` can *only* be one of these three specific string values.
  // - When `setActiveTab` is called (e.g., setActiveTab('projects')), React will re-render the Profile component, potentially showing different content based on the new `activeTab` value.

  // State for how many items to show initially/load more:
  const [displayCount, setDisplayCount] = useState(5);
  // - `displayCount`: Holds the number of posts/projects/prompts currently visible. Starts at 5.
  // - `setDisplayCount`: Function to update this number (e.g., when "Load More" is clicked).

  // State for controlling the Network (Followers/Following) dialog:
  const [showNetworkDialog, setShowNetworkDialog] = useState<'followers' | 'following' | null>(null);
  // - `showNetworkDialog`: Determines if the network dialog is open and which list it should show ('followers', 'following').
  // - Starts as `null` (meaning the dialog is closed).
  // - `setShowNetworkDialog`: Function to open ('followers'/'following') or close (null) the dialog.

  // State for managing prompt deletion confirmation:
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  // - `promptToDelete`: Holds the specific `Prompt` object the user wants to delete.
  // - Starts as `null` (no prompt selected for deletion). If it has a Prompt object, the confirmation dialog will show.
  // - `setPromptToDelete`: Function to set which prompt to delete or clear it (`null`).

  // State for managing prompt editing (currently a placeholder):
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  // - `promptToEdit`: Would hold the `Prompt` object being edited.
  // - Starts `null`. Functionality seems limited ("will be implemented soon").
  // - `setPromptToEdit`: Function to set/clear the prompt being edited.

  // State to control profile editing mode:
  const [isEditing, setIsEditing] = useState(false);
  // - `isEditing`: A boolean (true/false) flag. `false` means view mode, `true` means edit mode (showing input fields).
  // - Starts `false`.
  // - `setIsEditing`: Function to toggle between view and edit modes.

  // State for temporary storage of edited profile values:
  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedBio, setEditedBio] = useState('');
  // - These hold the values typed into the input fields while `isEditing` is `true`.
  // - They are initialized as empty strings. When editing starts, they get populated with the current user's data.
  // - `setEditedName`, `setEditedUsername`, `setEditedBio`: Functions to update these temporary values as the user types.

  // State to show/hide the username error message:
  const [showUsernameError, setShowUsernameError] = useState(false);
  // - `showUsernameError`: Boolean flag. `true` displays an error message if the chosen username is taken.
  // - Starts `false`.
  // - `setShowUsernameError`: Function to control the visibility of the error message.

  // Ref for the file input element:
  const fileInputRef = useRef<HTMLInputElement>(null);
  // - `useRef` is used here to get direct access to the hidden file input HTML element.
  // - This is useful because we want to trigger a click on this hidden input when the user clicks the camera icon overlay, without showing the default browser file input style.
  // - `<HTMLInputElement>` is TypeScript, specifying the type of element the ref will point to. `null` is the initial value before the element is rendered.

  // --- 4. Data Retrieval and Processing ---
  // NOTE: All this currently uses the imported dummy data. In a real app, this section would involve fetching data from your backend API (often using another hook like `useEffect`).


  

  if(loading) return <></>
  if(!currentUser) return <></>
  


  const profileUser = userId?user:currentUser
  // Check if the currently viewed profile belongs to the logged-in user:
  const isCurrentUser = profileUser.id === currentUser.id;
  // - Compares the ID of the `profileUser` with the ID of the `currentUser`.
  // - `isCurrentUser` will be `true` if they match, `false` otherwise. This is used later to show/hide things like the "Edit Profile" button.


  // Determine which user's profile to display:
  //! const profileUser: User = userId ? findUserById(userId) : currentUser;
  // - This is a conditional (ternary) operator: `condition ? value_if_true : value_if_false`.
  // - `userId ?`: Checks if `userId` (from the URL) exists.
  // - `findUserById(userId)`: If `userId` exists, call the dummy function to find that user in the `users` array.
  // - `currentUser`: If `userId` does *not* exist (meaning the user is likely viewing their *own* profile, e.g., navigating to just `/profile`), use the `currentUser` dummy object.
  // - `profileUser: User`: This assigns the result to the `profileUser` variable and tells TypeScript its structure must match the `User` type.

  

  // Filter posts to get only those belonging to the profile user:
  const userPosts = posts.filter(post => post.userId === profileUser.id);
  // - `posts.filter(...)`: Goes through the entire `posts` array (dummy data).
  // - `post => post.userId === profileUser.id`: For each `post` object, it checks if its `userId` property matches the `profileUser.id`.
  // - It creates a *new* array `userPosts` containing only the posts that satisfy the condition.

  // Filter the user's posts based on the active tab ('posts' or 'projects'):
  const filteredPosts = userPosts.filter(post =>
    activeTab === 'posts' ? !post.isProject : (activeTab === 'projects' ? post.isProject : false)
  );
  // - Filters `userPosts` further based on the `activeTab`.
  // - `activeTab === 'posts' ? !post.isProject`: If the active tab is 'posts', include the post only if `post.isProject` is `false` (or falsy).
  // - `(activeTab === 'projects' ? post.isProject : false)`: If the active tab is 'projects', include the post only if `post.isProject` is `true` (or truthy).
  // - `: false`: If the active tab is neither 'posts' nor 'projects' (e.g., 'marketplace'), include *nothing* in `filteredPosts` (this part seems slightly redundant given the later logic but ensures `filteredPosts` is only relevant for posts/projects tabs).

  // Get marketplace prompts created by the profile user:
  const userPrompts = getPromptsByCreator(profileUser.id);
  // - Calls the dummy function `getPromptsByCreator` with the profile user's ID to get an array of their prompts.

  // Determine the final list of items to display based on the active tab and display count:
  const displayItems = activeTab === 'marketplace'
    ? userPrompts.slice(0, displayCount) // If 'marketplace' tab, take a slice of userPrompts
    : filteredPosts.slice(0, displayCount); // Otherwise (posts/projects), take a slice of filteredPosts
  // - `slice(0, displayCount)`: Takes a portion of the array, starting from the beginning (index 0) up to (but not including) the `displayCount`. Initially shows the first 5 items.

  // Determine if there are more items to load:
  const hasMore = activeTab === 'marketplace'
    ? displayCount < userPrompts.length // Check if displayed prompts are less than total user prompts
    : displayCount < filteredPosts.length; // Check if displayed posts/projects are less than total filtered posts/projects
  // - `hasMore` is a boolean (`true`/`false`) used to show or hide the "Load More" button.

  // --- 5. Event Handlers and Helper Functions ---
  // These functions are called in response to user interactions (clicks, typing) or used internally.

  // Function to handle clicking the 'Network' / 'Networked' button:
  const handleNetworkToggle = () => {
    // In a REAL APP: This would send a request to your backend API to follow/unfollow the user.
    // For this dummy version:
    if (profileUser.isFollowing) {
      // If already following (dummy property), show an "info" notification.
      toast.info(`Removed ${profileUser.name} from your network`);
      // TODO: Update the dummy data (e.g., profileUser.isFollowing = false; profileUser.followers--;). This needs care as it might not persist correctly without proper state management or re-fetching.
    } else {
      // If not following, show a "success" notification.
      // TODO: Update dummy data (e.g., profileUser.isFollowing = true; profileUser.followers++;).
    }
    // Note: The dummy 'isFollowing' state isn't actually being toggled in the provided code, so the button text/style might not update visually without further changes or re-fetching/re-rendering logic.
  };

  // Function to change the active tab:
  const handleTabChange = (tab: 'posts' | 'projects' | 'marketplace') => {
    setActiveTab(tab); // Update the 'activeTab' state with the new tab value.
    setDisplayCount(5); // Reset the 'displayCount' back to 5 when switching tabs.
    // When `setActiveTab` is called, React re-renders the component. The `displayItems` and `hasMore` variables will be recalculated based on the new `activeTab`.
  };

  // Function to load more items:
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5); // Update 'displayCount' by adding 5 to its previous value.
    // `prev => prev + 5` is the "updater function" way to set state. It's useful when the new state depends on the old state.
    // React re-renders, and `displayItems.slice(0, displayCount)` will now include more items.
  };

  // Function to potentially refresh data (used by FeedItem):
  const handlePostUpdated = () => {
    // This function is passed down as a prop to FeedItem. FeedItem might call it after a post is edited or deleted.
    // Force a re-render by setting state (even to the same value).
    // This is a bit of a hacky way to force update. In a real app, you might re-fetch data or update the state array directly.
    setDisplayCount(displayCount);
     // Or potentially:
     // const updatedPosts = posts.filter(...); // Re-filter or fetch posts
     // (Need a state for posts to update it properly)
     // setPostsState(updatedPosts); // Example if posts were in state
  };

  // Helper function to get users the profileUser is *following* (Networking):
  const getNetworkedUsers = (): User[] => {
    // FAKE IMPLEMENTATION: Filters ALL users based on whether THEY are following the CURRENT user (or just `true`). Needs adjustment.
    // Should ideally be: Find users whose IDs are in `profileUser.followingIds` (assuming such a property exists).
    return users.filter(user => user.isFollowing || true); // Currently returns almost all users due to `|| true`.
    // In a REAL APP: Fetch the list of users the `profileUser` is following from the API.
  };

  // Helper function to get users who are *following* the profileUser (Networked):
  const getNetworkingUsers = (): User[] => {
    // FAKE IMPLEMENTATION: Just returns the first 8 dummy users.
    // Should ideally be: Find users whose `followingIds` array *includes* `profileUser.id`.
    return users.slice(0, 8); // Returns a fixed slice of the dummy `users` array.
    // In a REAL APP: Fetch the list of users following the `profileUser` from the API.
  };

  // Function to initiate deleting a prompt:
  const handleDeletePrompt = (prompt: Prompt) => {
    setPromptToDelete(prompt); // Set the 'promptToDelete' state to the selected prompt object. This will trigger the confirmation dialog to open.
  };

  // Function to confirm and execute prompt deletion:
  const confirmDeletePrompt = () => {
    if (!promptToDelete) return; // Do nothing if no prompt is selected.

    // In a REAL APP: Send a DELETE request to your backend API endpoint (e.g., /api/prompts/{promptToDelete.id}).
    // Upon success from the backend:
    toast.success(`Prompt "${promptToDelete.title}" deleted`); // Show success notification.
    setPromptToDelete(null); // Close the confirmation dialog by clearing the state.
    // AND Update the UI: You would need to remove the deleted prompt from the `userPrompts` list (ideally re-fetch or filter the state).
    // Example: setUserPrompts(currentPrompts => currentPrompts.filter(p => p.id !== promptToDelete.id)); // (If userPrompts were in state)
  };

  // Function to initiate editing a prompt:
  const handleEditPrompt = (prompt: Prompt) => {
    setPromptToEdit(prompt); // Set the prompt to be edited.
    // In a REAL APP: You would likely open a dialog or form pre-filled with the prompt's data.
    // Placeholder logic:
    toast.info("Prompt editing feature will be implemented soon");
    // Close the (non-existent) edit dialog after 1.5 seconds.
    setTimeout(() => setPromptToEdit(null), 1500);
  };

  // Function to toggle the profile editing mode on/off:
  const toggleEditMode = () => {
    if (isEditing) {
      // If currently editing, turn *off* edit mode:
      setIsEditing(false);
      setShowUsernameError(false); // Also hide any username error message.
    } else {
      // If currently viewing, turn *on* edit mode:
      // Pre-fill the temporary edit state variables with the current profile data.
      setEditedName(profileUser.name);
      setEditedUsername(profileUser.username);
      setEditedBio(profileUser.bio);
      setIsEditing(true); // Set the flag to true, causing the UI to show input fields.
    }
  };

  // Function to check if the edited username is already taken by another user:
  const checkUsername = (username: string) => {
    // Don't check if the username hasn't actually changed from the original.
    if (username === profileUser.username) {
      setShowUsernameError(false); // Ensure error is hidden.
      return false; // Not taken (because it's the user's current name).
    }

    // Check against the dummy 'users' array:
    const isTaken = users.some(user =>
      // Condition: Is there *some* user in the array...
      user.id !== profileUser.id && // ...who is NOT the current profile user...
      user.username.toLowerCase() === username.toLowerCase() // ...AND whose username (case-insensitive) matches the input `username`?
    );

    setShowUsernameError(isTaken); // Update state to show/hide the error message based on result.
    return isTaken; // Return true if taken, false if not.
    // In a REAL APP: This would involve an API call to the backend to check username availability.
  };

  // Function to save the changes made during profile editing:
  const saveProfileChanges = () => {
    if (checkUsername(editedUsername)) {
      return;
    }
    if (!editedName.trim()) { 
      toast.error("Name cannot be empty"); 
      return; 
    }
    profileUser.name = editedName;
    profileUser.username = editedUsername;
    profileUser.bio = editedBio;
    setIsEditing(false);
    toast.success("Profile updated successfully"); 
  };

  // Function to programmatically click the hidden file input:
  const triggerFileUpload = () => {
    // `fileInputRef.current` refers to the actual <input type="file"> DOM element.
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulates a user click on the file input.
    }
  };

  // Function to handle when a new profile picture file is selected:
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // `e` is the event object from the file input's 'change' event.
    const file = e.target.files?.[0]; // `e.target.files` is a list of selected files. `?.[0]` safely gets the first file, if it exists.
    if (!file) return; // Do nothing if no file was selected.

    // In a REAL APP:
    // 1. Create FormData: `const formData = new FormData(); formData.append('avatar', file);`
    // 2. Send POST/PUT Request: Send `formData` to your backend API endpoint for file uploads.
    // 3. Get Image URL: The backend would save the image and return its URL.
    // 4. Update User Data: Save the new image URL to the user's profile (via another API call or included in the upload response).
    // 5. Update UI: Update the user object in your state (e.g., `setCurrentUserState(...)`) to reflect the new avatar URL, causing a re-render.

    // For this DEMO version (using local file reader):
    const reader = new FileReader(); // Create a FileReader instance.
    reader.onload = () => {
      // This function runs *after* the file has been successfully read.
      if (typeof reader.result === 'string') {
        // `reader.result` contains the file data as a base64 Data URL (e.g., "data:image/png;base64,...").
        profileUser.avatar = reader.result; // Directly update the dummy `profileUser` object's avatar. (Again, direct mutation isn't ideal).
        toast.success("Profile picture updated");
        // Force a re-render (hacky way):
        setDisplayCount(displayCount);
        // A better way if `profileUser` was state: setProfileUserState({...profileUser, avatar: reader.result });
      }
    };
    reader.readAsDataURL(file); // Start reading the selected file as a Data URL.
  };

  // --- 6. Rendering Helper Functions (for JSX structure) ---

  // Function to render the list of Marketplace items:
  const renderMarketplaceItems = () => {
    return (
      // `div` with grid layout: displays items in 1 column on small screens, 2 columns on medium screens and up (`md:`). `gap-4` adds spacing.
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Map over the *sliced* userPrompts array */}
        {(userPrompts.slice(0, displayCount)).map((prompt) => (
          // Each prompt gets its own div. `key={prompt.id}` is crucial for React's list rendering performance and identity.
          <div key={prompt.id} className="relative"> {/* `relative` positioning context for the buttons */}
            {/* Render the actual PromptCard component, passing the prompt data as a prop */}
            <PromptCard prompt={prompt} />
            {/* Conditional Rendering: Show Edit/Delete buttons ONLY if viewing your own profile */}
            {isCurrentUser && (
              // Container for buttons, positioned absolutely at the top-right corner (`top-3`, `right-3`). Uses flexbox for layout.
              <div className="absolute top-3 right-3 flex space-x-1">
                {/* Edit Button */}
                <Button
                  variant="secondary" // Style variant (likely less prominent)
                  size="sm"           // Small size
                  className="h-8 w-8 p-0" // Custom classes for exact size and no padding
                  onClick={() => handleEditPrompt(prompt)} // Call handler when clicked
                >
                  <Edit className="h-4 w-4" /> {/* Edit icon */}
                </Button>
                {/* Delete Button */}
                <Button
                  variant="destructive" // Style variant (likely red/warning)
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDeletePrompt(prompt)} // Call handler when clicked
                >
                  <Trash2 className="h-4 w-4" /> {/* Trash icon */}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Function to render the list of Posts or Projects:
  const renderPostItems = () => {
    // Map over the `filteredPosts` array (sliced to `displayCount`).
    return filteredPosts.slice(0, displayCount).map((post: Post) => (
      // For each post, conditionally render either ProjectItem or FeedItem:
      post.isProject ? ( // Check the 'isProject' flag on the post object.
        <ProjectItem key={post.id} project={post} /> // If true, render ProjectItem, pass post data as 'project' prop.
      ) : (
        <FeedItem key={post.id} post={post} onPostUpdated={handlePostUpdated} /> // If false, render FeedItem, pass post data as 'post' prop and the update handler function.
      )
    ));
  };


  // --- 7. JSX Output (The UI Structure) ---
  // This is what the component actually renders to the screen. Uses HTML-like syntax combined with JavaScript logic.
  return (
    // Outermost container div
    <div>
      {/* Main content container: centered with max width, padding */}
      <div className="max-w-4xl mx-auto px-4">

        {/* --- Profile Header Section --- */}
        {/* Card-like container for profile info: background, blur, rounded corners, shadow, border, padding, margin bottom */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm border border-border/30 p-6 mb-6">
          {/* Flex container for aligning avatar/info block and the follow button */}
          <div className="flex items-start justify-between"> {/* `items-start`: align items to top, `justify-between`: push items to opposite ends */}

            {/* Left side: Avatar + Text Info */}
            <div className="flex items-start space-x-4"> {/* `space-x-4`: add horizontal space between children (avatar and text block) */}

              {/* Avatar container */}
              <div className="relative group"> {/* `relative` for positioning overlay, `group` for hover effects */}
                {/* Conditional Rendering: Show Camera Overlay only when `isEditing` is true */}
                {isEditing && (
                  // Overlay div: absolute positioning, covers parent, centered content, background, rounded, hidden by default (`opacity-0`), shown on hover (`group-hover:opacity-100`), transition effect
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={triggerFileUpload} // Call function to click hidden file input
                  >
                    <Camera className="w-6 h-6 text-white" /> {/* Camera Icon */}
                    {/* Hidden file input: Referenced by `fileInputRef` */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden" // Visually hides the input
                      accept="image/*" // Accepts any image file type
                      onChange={handleProfilePictureChange} // Call handler when a file is selected
                    />
                  </div>
                )}
                {/* Profile picture image */}
                <img
                  src={profileUser.avatar} // Image source from user data
                  alt={profileUser.name}  // Alt text for accessibility
                  className="avatar w-20 h-20" // Styling classes (assuming 'avatar' adds rounding, etc.) + specific width/height
                />
              </div>

              {/* Text Info block */}
              <div>
                {/* --- Conditional Rendering: EDITING MODE vs VIEW MODE --- */}
                {isEditing ? (
                  // --- If `isEditing` is true: Show Input Fields ---
                  <div className="space-y-3"> {/* Adds vertical spacing between edit fields */}
                    {/* Name Input */}
                    <div>
                      <Input
                        value={editedName} // Controlled component: value comes from state
                        onChange={(e) => setEditedName(e.target.value)} // Update state on typing
                        className="font-bold text-xl" // Styling
                        placeholder="Your name"
                      />
                    </div>
                    {/* Username Input */}
                    <div>
                      <div className="flex items-center space-x-1"> {/* Align '@' sign and input */}
                        <span className="text-muted-foreground">@</span>
                        <Input
                          value={editedUsername}
                          onChange={(e) => {
                            setEditedUsername(e.target.value); // Update username state
                            checkUsername(e.target.value);    // Check availability immediately on change
                          }}
                          className="" // Add specific styling if needed
                          placeholder="username"
                        />
                      </div>
                      {/* Conditional Rendering: Show username error message if needed */}
                      {showUsernameError && (
                        <p className="text-xs text-red-500 mt-1"> {/* Small red text for error */}
                          This username is already taken
                        </p>
                      )}
                    </div>
                    {/* Bio Textarea */}
                    <div>
                      <Textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)} // Update bio state
                        className="min-h-[80px]" // Minimum height for the textarea
                        placeholder="Write a short bio about yourself"
                      />
                    </div>
                    {/* Action Buttons (Save/Cancel) */}
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={saveProfileChanges} disabled={showUsernameError}> {/* Disable Save if username is invalid */}
                        <Save className="w-4 h-4 mr-1" /> {/* Save icon */}
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={toggleEditMode}> {/* Outline style for Cancel */}
                        <X className="w-4 h-4 mr-1" /> {/* Cancel icon */}
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // --- If `isEditing` is false: Show Static Text ---
                  <> {/* React Fragment: Groups elements without adding extra DOM node */}
                    <div className="flex items-center space-x-2"> {/* Align name and edit button */}
                      <h1 className="text-2xl font-bold text-foreground">{profileUser.name}</h1>
                      {/* Conditional Rendering: Show Edit Button only if it's the current user's profile */}
                      {isCurrentUser && (
                        <Button
                          variant="ghost" // Minimal button style
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full" // Small, circular, no padding
                          onClick={toggleEditMode} // Call function to enable editing mode
                        >
                          <Edit className="h-3.5 w-3.5" /> {/* Small edit icon */}
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground">@{profileUser.username}</p> {/* Display username */}
                    <p className="mt-2 text-foreground max-w-lg">{profileUser.bio}</p> {/* Display bio */}
                  </>
                )}

                {/* Conditional Rendering: Show Network Stats only when NOT editing */}
                {!isEditing && (
                  <div className="flex items-center mt-3 space-x-4">
                    {/* Following Count (Networking) - clickable */}
                    <button
                      onClick={() => setShowNetworkDialog('following')} // Open dialog showing 'following' list
                      className="hover:text-primary transition-colors" // Style change on hover
                    >
                      <span className="font-semibold text-foreground">{profileUser.following}</span> {/* Number from dummy data */}
                      <span className="ml-1 text-muted-foreground">Networking</span> {/* Label */}
                    </button>
                    {/* Followers Count (Networked) - clickable */}
                    <button
                      onClick={() => setShowNetworkDialog('followers')} // Open dialog showing 'followers' list
                      className="hover:text-primary transition-colors"
                    >
                      <span className="font-semibold text-foreground">{profileUser.followers}</span> {/* Number from dummy data */}
                      <span className="ml-1 text-muted-foreground">Networked</span> {/* Label */}
                    </button>
                  </div>
                )}
              </div> {/* End Text Info Block */}
            </div> {/* End Left Side Block */}

            {/* Right side: Network Button (only for OTHER users' profiles & when not editing) */}
            {!isCurrentUser && !isEditing && (
              // The button for Networking/Un-networking with the profileUser
              <button
                onClick={handleNetworkToggle} // Calls the function to toggle network status
                // Dynamic styling based on 'isFollowing' status (dummy data)
                className={`button-primary ${ // Base style class
                  profileUser.isFollowing ? 'bg-secondary text-foreground hover:bg-secondary/80' : '' // Style if following (e.g., grayed out)
                  // If not following, the default 'button-primary' style applies (likely a prominent color)
                }`}
              >
                {/* Button text changes based on 'isFollowing' status */}
                {profileUser.isFollowing ? 'Networked' : 'Network'}
              </button>
            )}
          </div> {/* End Header Flex Container */}

          {/* --- Profile Tabs Section --- */}
          {/* Container for tabs with a bottom border */}
          <div className="flex border-b border-border/30 mt-6">
            {/* Posts Tab Button */}
            <button
              onClick={() => handleTabChange('posts')} // Set active tab to 'posts'
              // Dynamic styling based on 'activeTab' state
              className={`pb-3 px-4 text-sm font-medium relative ${ // Base styling: padding, size, font, relative position
                activeTab === 'posts' ? 'text-primary' : 'text-muted-foreground' // Text color: primary if active, muted if not
              }`}
            >
              Posts
              {/* Conditional Rendering: Blue underline for the active tab */}
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" /> // Positioned underline element
              )}
            </button>
            {/* Projects Tab Button (similar logic) */}
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
            {/* Marketplace Tab Button (similar logic) */}
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
          </div> {/* End Tabs Container */}
        </div> {/* End Profile Header Card */}

        {/* --- Content Feed Section (Posts/Projects/Marketplace) --- */}
        {/* Container for the feed items with vertical spacing */}
        <div className="space-y-4">
          {/* --- Conditional Rendering: Show content OR empty message --- */}
          {displayItems.length > 0 ? ( // Check if there are any items to display for the current slice/tab
            // If items exist: Render based on active tab
            activeTab === 'marketplace' ?
              renderMarketplaceItems() : // Call helper function for marketplace items
              renderPostItems()           // Call helper function for posts/projects
          ) : (
            // If no items exist (displayItems is empty): Show empty state message
            <div className="text-center py-8"> {/* Centered text with vertical padding */}
              <p className="text-muted-foreground"> {/* Muted text color */}
                {/* Dynamic message based on active tab */}
                {activeTab === 'marketplace'
                  ? `${profileUser.name} hasn't created any prompts yet`
                  : `No ${activeTab} to display`}
              </p>
            </div>
          )}

          {/* --- Conditional Rendering: Load More Button --- */}
          {/* Show the button ONLY if the `hasMore` flag is true */}
          {hasMore && (
            <div className="flex justify-center my-6"> {/* Centered container with vertical margin */}
              <Button
                onClick={handleLoadMore} // Call function to increase displayCount
                variant="secondary"      // Less prominent style
                className="w-full max-w-xs" // Full width on small screens, max width of 'xs'
              >
                Load More
              </Button>
            </div>
          )}
        </div> {/* End Content Feed */}
      </div> {/* End Main Content Container */}

      {/* --- Dialogs (Pop-ups) --- */}
      {/* These are rendered here but only become visible when their respective state condition is met */}

      {/* Network Dialog (Followers/Following) */}
      <Dialog
        open={showNetworkDialog !== null} // Dialog is open if `showNetworkDialog` is NOT null
        onOpenChange={(isOpen) => !isOpen && setShowNetworkDialog(null)} // Function called when dialog tries to close (click outside, Esc key). If closing, set state back to null.
      >
        <DialogContent className="sm:max-w-[600px]"> {/* Dialog content area with max width */}
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"> {/* Title with icon */}
              <Users className="h-5 w-5" /> {/* Users icon */}
              {/* Dynamic title based on which list is shown */}
              {showNetworkDialog === 'followers' ? 'Networked with ' : 'Networking with '}
              {profileUser.name}
            </DialogTitle>
            {/* Optional: <DialogDescription> could go here */}
          </DialogHeader>
          {/* Scrollable area for the list */}
          <div className="max-h-[60vh] overflow-y-auto"> {/* Max height based on viewport height, vertical scroll if needed */}
            <Table> {/* Render the UI Table component */}
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>      {/* Column Header */}
                  <TableHead>Bio</TableHead>       {/* Column Header */}
                  <TableHead></TableHead>      {/* Column Header (for button) */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Dynamically choose which user list function to call based on dialog type */}
                {(showNetworkDialog === 'followers' ? getNetworkingUsers() : getNetworkedUsers())
                  // Map over the resulting array of users
                  .map((user) => (
                    // Render a table row for each user
                    <TableRow key={user.id}> {/* Unique key */}
                      {/* User Cell: Avatar + Name/Username */}
                      <TableCell className="flex items-center space-x-3">
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" /> {/* User avatar */}
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </TableCell>
                      {/* Bio Cell: Truncated */}
                      <TableCell className="text-sm truncate max-w-[200px]">{user.bio}</TableCell> {/* `truncate` hides overflow with '...' */}
                      {/* Action Cell: View Button */}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          // Navigate to the clicked user's profile page when clicked
                          // NOTE: This causes a full page reload. In a typical SPA, you'd use react-router's `useNavigate` hook for smoother transitions.
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
          {/* Optional: <DialogFooter> could contain closing buttons if needed */}
        </DialogContent>
      </Dialog>

      {/* Prompt Delete Confirmation Dialog */}
      <Dialog
        open={promptToDelete !== null} // Open if `promptToDelete` contains a prompt object
        onOpenChange={(open) => !open && setPromptToDelete(null)} // Close dialog by resetting state if user dismisses it
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              {/* Dynamic message showing the title of the prompt about to be deleted */}
              Are you sure you want to delete "{promptToDelete?.title}"? This action cannot be undone.
              {/* `?.` is optional chaining: safely accesses `title` only if `promptToDelete` is not null/undefined. */}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter> {/* Contains action buttons */}
            <Button variant="outline" onClick={() => setPromptToDelete(null)}>Cancel</Button> {/* Closes dialog */}
            <Button variant="destructive" onClick={confirmDeletePrompt}>Delete</Button> {/* Calls the delete confirmation function */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div> // End Outermost div
  );
};

// --- 8. Export ---
// Makes the Profile component available to be imported and used in other parts of your application (like your main router).
export default Profile;
