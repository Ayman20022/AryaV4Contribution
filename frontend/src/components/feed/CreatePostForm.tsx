import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import {
  Image,
  Link,
  Video,
  X,
  Loader2,
  Users,
  Globe,
  Lock,
  UserCheck,
  ChevronDown,
  Check,
  FileText,
} from "lucide-react"; // Added ChevronDown, Check, FileText
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { PostCreate } from "@/types/requests/post/PostCreate";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select"; // Import Radix Select
import { cn, getCustomAvatar } from "@/lib/utils";
import { PostService } from "@/services/PostService";
import { UserService } from "@/services/userService";
import { User } from "@/types/responses/data/user/User";
import { useUserStore } from "@/store";

type PostStatus = "PUBLIC" | "PRIVATE" | "DRAFT";

interface CreatePostFormProps {
  isProject?: boolean;
  onPostCreated?: () => void;
}

const statusOptions: {
  value: PostStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "PUBLIC", label: "Public", icon: Globe },
  { value: "PRIVATE", label: "Private", icon: Lock },
  { value: "DRAFT", label: "Draft", icon: FileText },
];

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  isProject = false,
  onPostCreated,
}) => {
  const currentUser = useUserStore((state) => state.user);

  const [text, setText] = useState("Hello World!");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [link, setLink] = useState("https://example.com");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(true);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showContributorInput, setShowContributorInput] = useState(false);
  const [contributorInput, setContributorInput] = useState("");
  const [contributorsNeeded, setContributorsNeeded] = useState<string[]>([
    "Open Contribution",
  ]);
  const [postStatus, setPostStatus] = useState<PostStatus>("PUBLIC");
  const [isNetworkingOnly, setIsNetworkingOnly] = useState(false);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const imagesInput = useRef<HTMLInputElement>(null);
  const videosInput = useRef<HTMLInputElement>(null);

  const isButtonDisabled =
    text.trim() === "" &&
    images.length === 0 &&
    videos.length === 0 &&
    !isProject;

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);
  const handleAddImage = () => {
    if (images.length >= 10) {
      toast.error("Maximum 10 images allowed.");
      return;
    }
    imagesInput.current?.click();
  };
  const handleOnAddedImage = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    if (files.length === 0) return;
    const limit = 10;
    const allowedFiles = files.slice(0, limit - images.length);
    if (allowedFiles.length < files.length) {
      toast.warning(
        `Only ${allowedFiles.length} of ${files.length} images added. Maximum is ${limit}.`
      );
    }
    if (allowedFiles.length > 0) {
      setImages((prev) => [...prev, ...allowedFiles]);
      toast.success(`Added ${allowedFiles.length} image(s)`);
    }
    target.value = "";
  };
  const handleRemoveImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));
  const handleToggleLinkInput = () => setShowLinkInput((prev) => !prev);
  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLink(e.target.value);
  const handleToggleVideoInput = () => setShowVideoInput((prev) => !prev); // Keep for hint text potentially
  const handleAddVideo = () => {
    if (videos.length >= 5) {
      toast.error("Maximum 5 videos allowed.");
      return;
    }
    videosInput.current?.click();
  };
  const handleOnAddedVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    if (files.length === 0) return;
    const limit = 5;
    const allowedFiles = files.slice(0, limit - videos.length);
    if (allowedFiles.length < files.length) {
      toast.warning(
        `Only ${allowedFiles.length} of ${files.length} videos added. Maximum is ${limit}.`
      );
    }
    if (allowedFiles.length > 0) {
      setVideos((prev) => [...prev, ...allowedFiles]);
      toast.success(`Added ${allowedFiles.length} video(s)`);
    }
    target.value = "";
  };
  const handleRemoveVideo = (index: number) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));
  const handleToggleContributorInput = () =>
    setShowContributorInput((prev) => !prev);
  const handleContributorInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setContributorInput(e.target.value);
  const handleAddContributor = () => {
    const trimmedInput = contributorInput.trim();
    if (!trimmedInput) {
      toast.error("Please enter a contributor type");
      return;
    }
    setContributorsNeeded((prev) => {
      const updated = prev[0] === "Open Contribution" ? [] : [...prev];
      if (!updated.includes(trimmedInput)) {
        updated.push(trimmedInput);
        setContributorInput("");
        toast.success(`Added "${trimmedInput}"`);
        return updated;
      } else {
        toast.info(`"${trimmedInput}" is already added`);
        return prev;
      }
    });
  };
  const handleRemoveContributor = (contributorToRemove: string) => {
    setContributorsNeeded((prev) => {
      const updated = prev.filter((c) => c !== contributorToRemove);
      return updated.length === 0 ? ["Open Contribution"] : updated;
    });
  };
  const handleResetToOpenContribution = () => {
    setContributorsNeeded(["Open Contribution"]);
    setShowContributorInput(false);
    setContributorInput("");
    toast.info("Reset to open contribution");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled && !isSubmitting) return;
    setIsSubmitting(true);

    const newPost: PostCreate = {
      type: isProject ? "PROJECT" : "POST",
      content: text || (isProject ? "Project details" : ""),
      status: postStatus,
      images: images.length > 0 ? images : [],
      videos: videos.length > 0 ? videos : [],
      neededContributors: isProject ? contributorsNeeded : null,
      isNetworkingOnly: isNetworkingOnly,
      link: link || undefined,
    };

    try {
      await PostService.create(newPost);
      toast.success(
        isProject ? "Project created successfully" : "Post created successfully"
      );
      setText("");
      setImages([]);
      setVideos([]);
      setLink("");
      setShowLinkInput(false);
      setShowVideoInput(false);
      setShowContributorInput(false);
      setContributorsNeeded(["Open Contribution"]);
      setPostStatus("PUBLIC");
      setIsNetworkingOnly(false);
      if (imagesInput.current) imagesInput.current.value = "";
      if (videosInput.current) videosInput.current.value = "";
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStatus = () => {
    return (
      statusOptions.find((option) => option.value === postStatus) ||
      statusOptions[0]
    );
  };
  const CurrentStatusIcon = getCurrentStatus().icon;

  const StyledSwitch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  ));
  StyledSwitch.displayName = SwitchPrimitive.Root.displayName;
  const StyledLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
        className
      )}
      {...props}
    />
  ));
  StyledLabel.displayName = LabelPrimitive.Root.displayName;

  const Select = SelectPrimitive.Root;
  const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
  >(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        "sm:w-auto bg-secondary/40 hover:bg-secondary/60 border-transparent focus:border-primary/30 focus:ring-1 focus:ring-primary/20 py-1.5 h-auto",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ));
  SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

  const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
  >(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          "max-h-60",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ));
  SelectContent.displayName = SelectPrimitive.Content.displayName;

  const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
  >(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ));
  SelectItem.displayName = SelectPrimitive.Item.displayName;

  const SelectValue = SelectPrimitive.Value;

  if (useUserStore((state) => state.isLoading)) {
    return <>Loading...</>;
  }

  return (
    <div className="post-card p-4 border rounded-lg shadow-sm bg-card">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start mb-4">
          <img
            src={
              currentUser.avatarUrl ||
              getCustomAvatar(currentUser.firstName, currentUser.lastName)
            }
            alt={currentUser.firstName + " " + currentUser.lastName}
            className="avatar w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="ml-3 flex-1 min-w-0">
            <textarea
              placeholder={
                isProject
                  ? "Describe your project vision and needs..."
                  : "Share an update, ask a question, or start a discussion..."
              }
              value={text}
              onChange={handleTextChange}
              disabled={isSubmitting}
              className="w-full p-2 rounded-lg bg-secondary/30 text-foreground resize-none border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all min-h-[80px] placeholder:text-muted-foreground/80"
            />

            {isProject && (
              <div className="mt-3 p-3 border rounded-lg bg-background/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Contributors Needed
                  </h3>
                  {contributorsNeeded.length > 1 ||
                  (contributorsNeeded.length === 1 &&
                    contributorsNeeded[0] !== "Open Contribution") ? (
                    <button
                      type="button"
                      onClick={handleResetToOpenContribution}
                      className="text-xs text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      Reset to open
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1">
                  {contributorsNeeded.map((contributor) => (
                    <Badge
                      key={contributor}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-0.5 text-xs font-normal"
                    >
                      {contributor}
                      {contributor !== "Open Contribution" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContributor(contributor)}
                          className="ml-1 text-muted-foreground hover:text-destructive focus:outline-none disabled:opacity-50"
                          disabled={isSubmitting}
                          aria-label={`Remove ${contributor}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {showContributorInput ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="e.g., Frontend Dev"
                      className="flex-grow p-1.5 px-2 rounded-md bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                      value={contributorInput}
                      onChange={handleContributorInputChange}
                      disabled={isSubmitting}
                      aria-label="Add specific contributor type"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddContributor();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddContributor}
                      className="px-2 py-1 text-xs button-secondary flex-shrink-0"
                      disabled={isSubmitting || !contributorInput.trim()}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleContributorInput}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                      disabled={isSubmitting}
                      aria-label="Cancel adding contributor"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleContributorInput}
                    className="text-xs text-primary hover:underline flex items-center mt-1 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <Users className="w-3 h-3 mr-1" /> Specify needed roles
                  </button>
                )}
              </div>
            )}

            {(images.length > 0 || videos.length > 0) && (
              <div className="mt-3 space-y-3">
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden group aspect-square bg-secondary/20"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onLoad={(e) =>
                            URL.revokeObjectURL(
                              (e.target as HTMLImageElement).src
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 disabled:opacity-20"
                          disabled={isSubmitting}
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {videos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden group bg-black/10 aspect-video"
                      >
                        <video
                          ref={
                            index === videos.length - 1 ? videoPreviewRef : null
                          }
                          src={URL.createObjectURL(video)}
                          className="w-full h-full object-contain"
                          controls
                          preload="metadata"
                          onLoadedMetadata={(e) =>
                            URL.revokeObjectURL(
                              (e.target as HTMLVideoElement).src
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 disabled:opacity-20"
                          disabled={isSubmitting}
                          aria-label={`Remove video ${index + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showVideoInput && videos.length < 5 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Video upload active. Max {5 - videos.length} more.
                </p>
              </div>
            )}

            {showLinkInput && (
              <div className="mt-3">
                <input
                  type="url"
                  placeholder="Paste a relevant link..."
                  className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all text-sm placeholder:text-muted-foreground/80"
                  value={link}
                  onChange={handleLinkChange}
                  disabled={isSubmitting}
                  aria-label="Relevant link"
                />
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Select
                value={postStatus}
                onValueChange={(value) => setPostStatus(value as PostStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  className="flex-shrink-0 w-full sm:w-[180px]"
                  aria-label="Post Visibility"
                >
                  <div className="flex items-center gap-x-2">
                    <CurrentStatusIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <SelectValue placeholder="Select visibility..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-x-2">
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <StyledSwitch
                  id="networkingOnly"
                  checked={isNetworkingOnly}
                  onCheckedChange={setIsNetworkingOnly}
                  disabled={isSubmitting}
                  aria-labelledby="networking-label"
                />
                <StyledLabel htmlFor="networkingOnly" id="networking-label">
                  Networking only
                </StyledLabel>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={handleAddImage}
              className="icon-button text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || images.length >= 10}
              aria-label={`Add image (${10 - images.length} remaining)`}
              title={`Add image (${10 - images.length} remaining)`}
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleAddVideo}
              className={cn(
                "icon-button hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed",
                videos.length > 0 ? "text-primary/80" : "text-muted-foreground"
              )}
              disabled={isSubmitting || videos.length >= 5}
              aria-label={`Add video (${5 - videos.length} remaining)`}
              title={`Add video (${5 - videos.length} remaining)`}
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleLinkInput}
              className={cn(
                "icon-button hover:text-primary disabled:opacity-50",
                showLinkInput ? "text-primary" : "text-muted-foreground"
              )}
              disabled={isSubmitting}
              aria-pressed={showLinkInput}
              aria-label={showLinkInput ? "Remove link input" : "Add link"}
              title={showLinkInput ? "Remove link input" : "Add link"}
            >
              <Link className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            className="button-primary disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={(isButtonDisabled && !isProject) || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-x-1.5">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isProject ? "Creating..." : "Posting..."}
              </span>
            ) : isProject ? (
              "Create Project"
            ) : (
              "Publish Post"
            )}
          </button>
        </div>

        <input
          ref={imagesInput}
          onChange={handleOnAddedImage}
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="hidden"
          aria-hidden="true"
        />
        <input
          ref={videosInput}
          onChange={handleOnAddedVideo}
          type="file"
          name="videos"
          accept="video/mp4,video/quicktime,video/x-matroska,video/webm"
          multiple
          className="hidden"
          aria-hidden="true"
        />
      </form>
    </div>
  );
};

export default CreatePostForm;
