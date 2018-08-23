## Menus
### Built on top of KnpMenuBundle and easily extensible


### Event subscribers and listeners
You can hook into the following events:

- `ConfigureMenuEvent::MAIN_MENU`
- `ConfigureMenuEvent::USER_MENU`
- `ConfigureMenuEvent::CONTENT_SIDEBAR_RIGHT`
- `ConfigureMenuEvent::USER_MENU`

and a lot more...


### An event must implement `EventSubscriberInterface`
#### `Symfony\Component\EventDispatcher\EventSubscriberInterface`


```php
    $menu = $event->getMenu();
    $menu->addChild(
        self::ITEM_POLL_LIST,
        [
            'route' => 'ez_systems_poll_list',
            'extras' => ['translation_domain' => 'menu'],
        ]
    );
```
