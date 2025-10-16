package backend.back_temp_chat.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.back_temp_chat.entity.GroupChat;
import backend.back_temp_chat.service.IService.IGroupChatService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GroupChatController {

    private IGroupChatService groupChatService;

    @PostMapping("/create")
    public GroupChat createGroup(@RequestBody GroupChat groupChat) {
        return groupChatService.createGroup(groupChat);
    }

    @GetMapping("/active")
    public List<GroupChat> getAllActiveGroups() {
        return groupChatService.getAllActiveGroups();
    }
}