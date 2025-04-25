import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/userService";
import { toast } from "sonner";

const ALL_INTERESTS = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Data Science",
  "Machine Learning",
  "AI Engineering",
  "Game Development",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Blockchain",
  "Product Management",
  "Graphic Design",
  "3D Modeling",
  "Animation",
  "Creative Writing",
];

const UserInterestsPage: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length === 0) {
      toast.success("Please select at least one interest.");
      return;
    }

    setIsLoading(true);

    try {
      UserService.update({ preferences: selectedInterests.join(",") });
      toast.success("Your interests have been saved successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(
        "An error occurred while saving your interests. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-primary">
        Select Your Interests
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Choose topics you're interested in to personalize your Sphere
        experience.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {ALL_INTERESTS.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`p-4 rounded-lg text-center font-medium border transition-colors duration-200 ${
              selectedInterests.includes(interest)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-accent border-border"
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={handleSaveInterests}
          disabled={isLoading || selectedInterests.length === 0}
          size="lg"
          className="min-w-[150px]"
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default UserInterestsPage;
