import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../service/message.service";

export const useMessages = (
    groupId: string | null
) => {

    return useQuery({
        queryKey: ["messages", groupId],

        queryFn: () => getMessages(groupId!),

        enabled: !!groupId,
    });

};