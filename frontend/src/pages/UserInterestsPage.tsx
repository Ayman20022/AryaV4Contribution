
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ALL_INTERESTS = [
  "Web Development", "Mobile Development", "UI/UX Design", "Data Science",
  "Machine Learning", "AI Engineering", "Game Development", "Cybersecurity",
  "Cloud Computing", "DevOps", "Blockchain", "Product Management",
  "Graphic Design", "3D Modeling", "Animation", "Creative Writing"
];

const UserInterestsPage: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length === 0) {
        toast({
            title: "Select Interests",
            description: "Please select at least one interest.",
            variant: "destructive"
        })
        return;
    }

    setIsLoading(true);
    console.log("Selected interests:", selectedInterests);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      localStorage.setItem('userInterestsSelected', 'true');
      console.log('User interests selection marked as complete.');

      window.dispatchEvent(new StorageEvent('storage', { key: 'userInterestsSelected', newValue: 'true' }));


      toast({
        title: "Interests Saved!",
        description: "Your feed will now be personalized.",
      });

      navigate('/', { replace: true }); 

    } catch (error) {
      console.error("Failed to save interest selection flag:", error);
       toast({
            title: "Error",
            description: "Could not save your preferences flag. Please try again.",
            variant: "destructive"
       })
       setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-primary">Select Your Interests</h1>
      <p className="text-center text-muted-foreground mb-8">
        Choose topics you're interested in to personalize your Sphere experience.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {ALL_INTERESTS.map(interest => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`p-4 rounded-lg text-center font-medium border transition-colors duration-200 ${
              selectedInterests.includes(interest)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card hover:bg-accent border-border'
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
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default UserInterestsPage;