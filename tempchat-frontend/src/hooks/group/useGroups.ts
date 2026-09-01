import { useQuery } from "@tanstack/react-query";
import { getGroups } from "../../service/group.service";


export const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: getGroups,
    });
};