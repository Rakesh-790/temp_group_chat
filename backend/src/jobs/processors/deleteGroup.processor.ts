import { deleteExpiredGroup } from "../../modules/groups/group.service";

interface DeleteGroupJobData {
    groupId: string
}

export const processDeleteGroup = async(
    data : DeleteGroupJobData
) : Promise<void> => {

    const { groupId } = data;
    
    await deleteExpiredGroup(groupId);
};