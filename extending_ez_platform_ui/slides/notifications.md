## Notifications
#### are sent to a specific user. They will appear in their profile in the Back Office.

![notification](assets/img/notification.png)


##### inject `NotificationService`

```php
// Controller/PollController.php
use eZ\Publish\API\Repository\NotificationService;

public function __construct( NotificationService $notificationService)
{
    $this->notificationService = $notificationService;
}
```


##### create notification's `CreateStruct`

```php
// Controller/PollController.php

$notificationStruct = new CreateStruct();
$notificationStruct->ownerId = $sendToUserId;
$notificationStruct->type = 'Poll:Vote';
$notificationStruct->data = [
    'fieldId' => $pollData->getFieldId(),
    'question' => $pollData->getQuestion()
];
```


##### use `createNotification()` method

```php
// Controller/PollController.php

$this->notificationService->createNotification($notificationStruct);

```


##### To display the notification, write a Renderer and tag it as a service

```php
use eZ\Publish\Core\Notification\Renderer\NotificationRenderer;

class Renderer implements NotificationRenderer {
    
    public function render(Notification $notification): string {
        ...
    }

    public function generateUrl(Notification $notification): ?string {
        ...
    }
}
```


#### add notification's template

```twig
{# Resources/views/notification/notification_row.html.twig #}
{% extends '@EzPlatformAdminUi/notifications/notification_row.html.twig' %}

{% block icon %}
{% endblock %}

{% block message %}
{% endblock %}
```


#### add an entry to `services.yml`
```yml
# Resources/config/services.yml

AppBundle\Notification\Renderer:
    tags:
        - { name: ezpublish.notification.renderer, alias: 'Poll:Vote' }
```
