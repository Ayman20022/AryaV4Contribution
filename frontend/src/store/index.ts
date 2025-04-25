import { UserService } from '@/services/userService';
import { User } from '@/types/responses/data/user/User';
import { create } from 'zustand';

type UserStore = {
    user: User;
    getUser: () => Promise<void>;
    setUser: (user: User) => void;
    isLoading: boolean;
}

export const useUserStore = create<UserStore>((set) => (
    {
        user: null,
        isLoading: true,
        getUser: async () => {
            try {
                const { data } = await UserService.getMe();
                set({ user: data });
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                set({ isLoading: false });
            }
        },
        setUser: (user) => set(() => ({ user: user, isLoading: false })),

    }
));

export const useUser = () => useUserStore((state) => state.user);
export const useGetUser = () => useUserStore((state) => state.getUser);