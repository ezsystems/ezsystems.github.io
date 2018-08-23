## Extending dashboard
### Creating a Dashboard tab


### We will fetch all polls added to Content Types
#### and add them to Everyone tab in the Dashboard


#### Register `EveryonePollTab` as a tab
```yml
# Resources/config/services.yml
services:
    ...
    AppBundle\Tab\Dashboard\Everyone\EveryonePollTab:
        tags:
            - { name: ezplatform.tab, group: dashboard-everyone }
```


#### Create a tab
```php
// Tab/Dashboard/Everyone/EveryonePollTab.php

use EzSystems\EzPlatformAdminUi\Tab\AbstractTab;
use EzSystems\EzPlatformAdminUi\Tab\OrderedTabInterface;

class EveryoneArticleTab extends AbstractTab implements OrderedTabInterface
```


Create Content To Poll Data Mapper for ease of use we create mapper which extracts polls from content

```php
// Tab/Dashboard/ContentToPollDataMapper.php

/** @var \eZ\Publish\Core\Repository\Values\Content\Content $content */
foreach ($pager as $content) {
    foreach ($content->getFields() as $field) {
        if ($field->fieldTypeIdentifier === 'ezpoll') {
            $data[] = [
                'contentId' => $content->id,
                'name' => $contentInfo->name,
                ...
                'question' => $field->value->question,
                'answers' => $field->value->answers,
            ];
        }
    }
}

```


### Create a template
We can copy one of existing dashboard template and change it to display polls data

```twig
{# Resources/views/dashboard/tab/all_poll.html.twig #}

```