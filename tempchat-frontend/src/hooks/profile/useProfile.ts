import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../service/profile.service";



export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });
};