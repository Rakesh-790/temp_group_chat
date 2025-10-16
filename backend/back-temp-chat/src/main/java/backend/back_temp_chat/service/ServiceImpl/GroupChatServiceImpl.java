package backend.back_temp_chat.service.ServiceImpl;

import java.util.Date;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import backend.back_temp_chat.entity.GroupChat;
import backend.back_temp_chat.repository.GroupChatRepository;
import backend.back_temp_chat.service.IService.IGroupChatService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupChatServiceImpl implements IGroupChatService{

    private final GroupChatRepository groupChatRepository;

    @Override
    public GroupChat createGroup(GroupChat groupChat) {
        groupChat.setCreatedAt(new Date());
        return groupChatRepository.save(groupChat);
    }

    @Override
    public List<GroupChat> getAllActiveGroups() {
        return groupChatRepository.findByExpireAtAfter(new Date());
    }

    @Override
    @Scheduled(fixedRate = 60000) // every minute
    public void deleteExpiredGroups() {
        groupChatRepository.deleteExpiredGroups(new Date());
    }
}
