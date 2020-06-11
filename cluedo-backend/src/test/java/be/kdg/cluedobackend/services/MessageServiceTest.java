package be.kdg.cluedobackend.services;

import be.kdg.cluedobackend.exceptions.CluedoException;
import be.kdg.cluedobackend.model.chat.Message;
import be.kdg.cluedobackend.model.game.Cluedo;
import be.kdg.cluedobackend.model.users.Player;
import be.kdg.cluedobackend.model.users.Role;
import be.kdg.cluedobackend.model.users.User;
import be.kdg.cluedobackend.repository.CluedoRepository;
import be.kdg.cluedobackend.repository.MessageRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@SpringBootTest
@RunWith(SpringRunner.class)
@Transactional
public class MessageServiceTest {

    @MockBean
    private MessageService messageService;

    private User testUser1;
    private User testUser2;
    private Cluedo testCluedo1;
    private Message testMessage1;
    private Message testMessage2;

    @Before
    public void setUp() {
        testUser1 = new User(UUID.randomUUID(), "TestUser1", List.of(Role.USER));
        testMessage1 = new Message();
        testMessage1.setContent("Hallo World");
        testMessage1.setUser(testUser1);
        testMessage1.setTimestamp(new Date());

        testMessage2 = new Message();
        testUser2 = new User(UUID.randomUUID(), "TestUser2", List.of(Role.USER));
        testMessage2.setContent("Hey there");
        testMessage2.setUser(testUser2);
        testMessage2.setTimestamp(new Date());

        testCluedo1 = new Cluedo();
        testCluedo1.setCluedoId(1);
    }

    @Test
    public void getMessagesTest() throws CluedoException {
        given(messageService.getMessages(testCluedo1.getCluedoId())).willReturn(Arrays.asList(testMessage1,testMessage2));
        List<Message> list = messageService.getMessages(testCluedo1.getCluedoId());

        Assert.assertEquals(list.size(),2);

        Assert.assertEquals(list.get(0).getContent(),"Hallo World");
        Assert.assertEquals(list.get(1).getContent(),"Hey there");

        Assert.assertNotEquals(list.get(0).getContent(),"holaaa");
        Assert.assertNotEquals(list.get(1).getContent(),"Hallo World");

        Assert.assertEquals(list.get(0).getUser().getUserName(),"TestUser1");
        Assert.assertEquals(list.get(1).getUser().getUserName(),"TestUser2");
    }


}
