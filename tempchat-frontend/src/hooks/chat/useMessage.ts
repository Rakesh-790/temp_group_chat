import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../service/message.service";


export const messageKeys = {
    all: ["messages"] as const,

    group: (groupId: string) =>
        [...messageKeys.all, groupId] as const,
};

export const useMessages = (
    groupId: string | null
) => {

    return useQuery({
        queryKey: groupId
            ? messageKeys.group(groupId)
            : messageKeys.all,

        queryFn: () => getMessages(groupId!),

        enabled: !!groupId,

        staleTime: 30 * 1000,

        gcTime: 5 * 60 * 1000,

        refetchOnWindowFocus: false,

        refetchOnReconnect: true,

        retry: 2,
    });

};