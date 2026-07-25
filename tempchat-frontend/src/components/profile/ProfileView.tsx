import { User } from "lucide-react";

const ProfileView = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-[#0b141a]">
            <div className="mb-6 rounded-full bg-[#202c33] p-8">
                <User size={72} className="text-[#8696a0]" />
            </div>

            <h2 className="text-3xl font-semibold text-white">
                Profile
            </h2>

            <p className="mt-3 text-[#8696a0]">
                View and edit your profile information.
            </p>
        </div>
    );
};

export default ProfileView;