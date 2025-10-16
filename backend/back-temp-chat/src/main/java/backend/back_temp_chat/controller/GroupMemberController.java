package backend.back_temp_chat.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import backend.back_temp_chat.entity.GroupMember;
import backend.back_temp_chat.service.IService.IGroupMemberService;
import lombok.RequiredArgsConstructor;

@RestControllerAdvice
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GroupMemberController {
    
    private IGroupMemberService groupMemberService;

    @PostMapping("/add")
    public GroupMember addMember(@RequestBody GroupMember member) {
        return groupMemberService.addMember(member);
    }

    @GetMapping("/group/{groupId}")
    public List<GroupMember> getMembersByGroup(@PathVariable String groupId) {
        return groupMemberService.getMembersByGroupId(groupId);
    }

    @GetMapping("/user/{userId}")
    public List<GroupMember> getGroupsByUser(@PathVariable String userId) {
        return groupMemberService.getGroupsByUserId(userId);
    }
}
