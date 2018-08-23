## Data visualization
### Creating a poll list


### Bootstrap
We rely on Bootstrap's framework which makes eZ Platform UI easier to extend. It facilitates adapting and styling the interface to your needs.


### Add routing to list
```yml
ez_systems_poll_list:
    path:     /poll/list
    defaults: { _controller: AppBundle:Poll:list }

ez_systems_poll_show:
    path:     /poll/show/{fieldId}/{contentId}
    defaults: { _controller: AppBundle:Poll:show }
```


### Create a controller
#### It will extend the `EzPlatformAdminUiBundle` controller


### Add a template
#### To easily customize the list view to the appearance of the Admin Panel it should extend:
```twig
{% extends '@ezdesign/layout.html.twig' %}
```


### Some of the available blocks
```
{% block body_class %}

{% block breadcrumbs %}

{% block page_title %}

{% block content %}
```


### Pagination
#### To handle pagination we are using `WhiteOctoberPagerfantaBundle`, which is a great library for pagination.

[white-october/pagerfanta-bundle](https://github.com/whiteoctober/WhiteOctoberPagerfantaBundle)


### In the same way we can add detail view for the poll.
