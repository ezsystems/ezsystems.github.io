## Menus
### Build on top of KnpMenuBundle and easily extensible


### Event subscribers and listeners
You can hook into the following events

- `ConfigureMenuEvent::MAIN_MENU`
- `ConfigureMenuEvent::USER_MENU`
- `ConfigureMenuEvent::CONTENT_SIDEBAR_RIGHT`
- `ConfigureMenuEvent::USER_MENU`

and a lot more..


### An event must implements `EventSubscriberInterface`
#### `Symfony\Component\EventDispatcher\EventSubscriberInterface`


```
    $menu = $event->getMenu();
    $menu->addChild(
        self::ITEM_POLL_LIST,
        [
            'route' => 'ez_systems_poll_list',
            'extras' => ['translation_domain' => 'menu'],
        ]
    );
```


```
{
  "data": {
    "hero":
    {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```


### The prototype

[bdunogier/ezplatform-graphql-bundle](https://github.com/bdunogier/ezplatform-graphql-bundle)

Based on [webonyx/graphql-php](https://github.com/webonyx/graphql-php) and
[overblog/graphqlbundle](https://github.com/overblog/graphqlbundle).


### Is it good ?


### Yes.


### More ?
- Surprisingly easy to implement
- Great usability
  - List all content types, with field definitions and types
  - Types can be inspected when browsing
  - Browsing content is really convenient


![Come here](https://media.giphy.com/media/26BRzQS5HXcEWM7du/giphy.gif)


### Flexible FieldType
- GraphQL Interfaces
  `... on InterfaceName { InterfaceSpecificField }`

- Interface per fieldtype
  - Variations of an image
  - Converted richtext
  - Direct access to relations
  - Geo coordinates from location


![Come here](https://media.giphy.com/media/26BRzQS5HXcEWM7du/giphy.gif)


### Fitting YOUR content model
We could go even further:

```
{
  contentModel {
    article {
      name { text }
      intro { html5 }
    }
    place {
      name { text }
      location { address latitude longitude }
    }
  }
}
```


![Come here](https://media.giphy.com/media/26BRzQS5HXcEWM7du/giphy.gif)

(one last time)


### Limitations
- Limited to reading, no writing (mutations)
  - Not adapted to managing content
  - Can apply to lightweight application use-cases
    - comments
    - ratings
- Not optimised


### Future
Rework will have to happen one day


### REST V3: API Platform ?


- Centered around entities and operations on those
- Our entities are value objects
- Uses Symfony Serialization


- Very well maintained
- Modern formats, HATOAS
- GraphQL (using webonyx)
- Schema.org
- Dynamically self-documented (Swagger/OpenAPI)
- Built to be re-used by your own code
