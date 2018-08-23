## Poll Field Type
### site


### Creating an `PollVote` Entity Class

- question
- answer
- fieldId
- contentId

```bash
bin/console doctrine:schema:update --dump-sq
```


### final class PollVoteRepository


### `PollType` class

```php
public function buildForm(FormBuilderInterface $builder, array $options)
{
    $choices = array_filter($options['answers'], function($value) {
        return $value !== null;
    });
    ...
}
``` 

```php
public function configureOptions(OptionsResolver $resolver)
{
    ....
    $resolver->setRequired('answers');
}
```


### FormFactory

```php
    public function createPollForm(
        PollVote $data,
        ?string $name = null,
        array $answers
    ): FormInterface {
        $name = $name ?: StringUtil::fqcnToBlockPrefix(PollType::class);
        $options = null !== $answers ? ['answers' => $answers] : [];

        return $this->formFactory->createNamed(
            $name,
            PollType::class,
            $data,
            $options
        );
    }
```


#### `PollController::voteAction()`
We need a new method to handle voting


### `ParameterProvider`
provides additional parameters to a fieldtype's view template

```php
class ParameterProvider implements ParameterProviderInterface
{
    public function getViewParameters(Field $field)
    {
        $pollData = new PollVote();
        $pollData->setQuestion($field->value->question);
        $pollForm = $this->formFactory->createPollForm($pollData, null, $field->value->answers);

        return [
            'pollForm' => $pollForm->createView(),
        ];
    }
}
```


#### `ParameterProvider` needs to be registered in the `ParameterProviderRegistry`
```yml
services:
    ...
    AppBundle\eZ\Publish\FieldType\Poll\ParameterProvider:
        tags:
            - {name: ezpublish.fieldType.parameterProvider, alias: ezpoll}
```


#### Create Field Type template for the site siteaccess

```twig
{# Resources/views/ezpoll_view.html.twig #}
{% extends "EzPublishCoreBundle::content_fields.html.twig" %}

{% block ezpoll_field %}
    ...
    {{ form_start(parameters.pollForm, {'action': path('ez_systems_poll_vote', {
        'contentId': content.id,
        'fieldDefIdentifier': field.fieldDefIdentifier
    }), 'method': 'POST'}) }}
    {{ form_widget(parameters.pollForm) }}
    ...
{% endblock %}
```


#### Register Field Type template for the site siteaccess
```yml
system:
    site:
        field_templates:
            - {template: 'AppBundle::ezpoll_view.html.twig', priority: 0}
```
