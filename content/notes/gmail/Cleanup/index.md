---
title: Cleanup Gmail messages by filter
weight: 1
date: "2022-09-13T08:00:00.000Z"
menu:
  notes:
    name: Cleanup
    identifier: gmail-cleanup
    parent: gmail
    weight: 1
---

<!-- Variable -->
{{< note title="Cleanup Gmail emails by filter" >}}
This is example how to remove Github Notifications of failed jobs after 7 days:
```javascript
function cleanupByFilter() {
  deleteEmails('from:notifications@github.com older_than:7d subject: "Run failed"')
  // For more filters add more `deleteEmails` function executions here 
}

function deleteEmails(filter) {
  var threads = GmailApp.search(filter);
  Logger.log("Deleting " + threads.length + " messsages from filter: " + filter)
   for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
         var message = messages[j];
         message.markRead()
         message.moveToTrash()
      }
   }
}
```

To setup this see my post [here](/posts/label-gitlab-notifications/). 
