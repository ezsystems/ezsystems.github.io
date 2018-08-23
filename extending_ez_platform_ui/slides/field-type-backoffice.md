## Field Type
### backoffice


### The Value class
represents an instance of the Field Type  
within a Content item
```php
// AppBundle/eZ/Publish/FieldType/Poll/Value.php

use eZ\Publish\Core\FieldType\Value as BaseValue;

class Value extends BaseValue
{
}
```


#### The Value class will contain at least:

- public properties: used to store the actual data
- an implementation of `__toString()`


### The Type class
contains the logic of the Field Type  
e.g. validating and transforming data
```php
// AppBundle/eZ/Publish/FieldType/Poll/Type.php

use eZ\Publish\Core\FieldType\FieldType;
use eZ\Publish\SPI\FieldType\Nameable;

class Type extends FieldType implements Nameable
{
}
```


### Identification method
- `getFieldTypeIdentifier()` returns the string that uniquely identifies the Field Type


### Value handling methods

- `createValueFromInput()` provides convenient way to set an attribute's value using the API
- `checkValueStructure()` checks that the Value fed to the Type is acceptable


### Value initialization
- `getEmptyValue()` provides what is considered an empty value of this type


### Validation
- `validate()` runs the validation on data, when a Content item is created with a Field of this type


### Metadata handling methods
- `getFieldName()` generates a name out of a Field value
- `getSortInfo()` is used by the persistence layer to obtain the value it can use to sort and filter on a Field of this Field Type


### serialization methods
- `fromHash()` builds a hash with every property from `Value`
- `toHash()` instantiates a `Value` with the hash it receives


### `PersistenceValue`
#### structure understood by the persistence layer

This is a simple value object with three properties:
- data
- externalData
- sortKey


### Persistence methods
- `fromPersistenceValue()` builds a hash with every property from `Value`
- `toPersistenceValue()` instantiates a `Value` with the hash it receives


### deprecated
- `getName()` replaced by `getFieldName()`


### Field Type as a service

> to be closer to kernel best practices, you should declare the Field Type services in a custom fieldtypes.yml file

```php
// AppBundle/DependencyInjection/AppExtension

$loader->load('fieldtypes.yml');
```


### Field Type as a service
##### Each service tagged as `ezpublish.fieldType` is added to a registry using the alias argument as its unique identifier

```yml
# AppBundle/Resources/config/fieldtypes.yml

services:
    AppBundle\eZ\Publish\FieldType\Poll\Type:
        parent: ezpublish.fieldType
        tags:
            - {name: ezpublish.fieldType, alias: ezpoll}
            - {name: ezpublish.fieldType.nameable, alias: ezpoll}
```


### Legacy Storage Engine Converter
#### we need to map each Field Type value to something Legacy storage engine can understand


### `Poll\LegacyConverter`

```php
//AppBundle/eZ/Publish/FieldType/PollLegacyConverter.php

namespace AppBundle\eZ\Publish\FieldType\Poll;

use eZ\Publish\Core\Persistence\Legacy\Content\FieldValue\Converter;

class LegacyConverter implements Converter
{
}
```


### Converter interface

- `toStorageValue()` and `toFieldValue()` used to convert between an API field value and legacy storage value
- `toStorageFieldDefinition()` and `toFieldDefinition()` used to convert between a Field definition and a legacy one
- `getIndexColumn()` tells the API which legacy database field should be used to sort and filter content


### Registering the converter
##### Legacy Converter needs to be registered and tagged in the service container

```yml
# AppBundle/Resources/config/fieldtypes.yml
services:
    ...
    AppBundle\eZ\Publish\FieldType\Poll\LegacyConverter:
        tags:
            - {name: ezpublish.storageEngine.legacy.converter, alias: ezpoll}
```


### Introduce a template
#### template must:
- extend `EzPublishCoreBundle::content_fields.html.twig`
- define a dedicated Twig block for the type, named by convention <TypeIdentifier_field>
- be registered in parameters


### `ezpoll.html.twig` template
- Each Field Type template receives a set of variables e.g. `field`, `content`.
- `field` is an instance of `eZ\Publish\API\Repository\Values\Content\Field`.
- Field Value is available through the `value` property.


### Registering the template
#### Field Type template needs to be registered in the eZ Platform semantic configuration.

`PrependExtensionInterface` from `Symfony\Component\DependencyInjection\Extension\` will let us prepend bundle configuration.


```php
namespace AppBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;

class AppExtension extends Extension implements PrependExtensionInterface
{
    public function prepend(ContainerBuilder $container)
    {
        $configFilePath = __DIR__.'/../Resources/config/ez_field_templates.yml';
        $config = Yaml::parse(file_get_contents($configFilePath));
        $container->prependExtensionConfig('ezpublish', $config);
    }
    ...
}
```


### Template mapping

```yml
# AppBundle/Resources/config/ez_field_templates.yml
system:
    admin_group:
        field_templates:
            - { template: 'AppBundle:platformui/field:ezpoll_view.html.twig', priority: 0 }
```

>we do not need to provide the `ezpublish` YAML block here because we already import the configuration under the `ezpublish` namespace in the `prepend` method


### Adding and editing the Field in Back Office

We need to create a `FormMapper` with `FieldValueFormMapperInterface`. It is used to automatically add the input field to the Content Type edit form.


```php
// AppBundle/eZ/Publish/FieldType/Poll/FormMapper.php
public function mapFieldValueForm(FormInterface $fieldForm, FieldData $data) {
    ...
    $fieldForm->add(
        $formConfig->getFormFactory()
            ->createBuilder()
            ->create('value', PollFieldType::class, [
                'required' => false,
                'label' => $label,
                'answer_limit' => $answerLimit,
            ])
            // Deactivate auto-initialize as we're not on the root form.
            ->setAutoInitialize(false)
            ->getForm()
    );
}
```


### Register the FormMapper as a service
```yml
# AppBundle/Resources/config/fieldtypes.yml
services:
    ...
    AppBundle\eZ\Publish\FieldType\Poll\FormMapper:
        tags:
            - {name: ez.fieldFormMapper.value, fieldType: ezpoll}
```


### DataTransformer
#### tells the `FormMapper` how to transform between the value object and hash.  

```php
namespace AppBundle\Form;

use Symfony\Component\Form\DataTransformerInterface;

class PollValueTransformer implements DataTransformerInterface
{
}
```


#### Add the `DataTransformer` to `FormMapper`
```php
// AppBundle/eZ/Publish/FieldType/Poll/FormMapper.php

$formConfig->addModelTransformer(
    new PollValueTransformer($fieldType)
)
```


#### Add a validation

- add `validateValidatorConfiguration()` and `validate()` methods in the Type class
- implement an additional interface in the FormMapper
- add Field definition edit view
- implement `toStorageFieldDefinition()` and `toFieldDefinition()` methods in LegacyConverter


`validateValidatorConfiguration()` is called when an instance of the Field Type is added to a Content Type, to ensure that the validator configuration is valid.


### Validator schema configuration

```php
// AppBundle/eZ/Publish/FieldType/Poll/Type.php

protected $validatorConfigurationSchema = [
    'QuestionLengthValidator' => [
        'minStringLength' => [
            'type' => 'int',
            'default' => 0,
        ],
    ],
];
```


#### `validateValidatorConfiguration()`

We will iterate over the items in `$validatorConfiguration` and
- add errors for validators you don't know about;
- check that provided arguments are known and valid


#### `validate()` is the method that runs the actual validation on data

```php
// AppBundle/eZ/Publish/FieldType/Poll/Type.php

public function validate(FieldDefinition $fieldDefinition, SPIValue $fieldValue)
{
    $validationErrors = [];

    $validatorConfiguration = $fieldDefinition->getValidatorConfiguration();
    $questionLengthConstraints = $validatorConfiguration['QuestionLengthValidator'] ?? [];

        ...
        $validationErrors[] = new ValidationError(
        ...

    return $validationErrors;
}
```


Implement `FieldDefinitionFormMapperInterface` in FormMapper
that allows us to define the necessary input field.
```php
// AppBundle/eZ/Publish/FieldType/Poll/FormMapper.php

public function mapFieldDefinitionForm(FormInterface $fieldDefinitionForm, FieldDefinitionData $data)
{
    $fieldDefinitionForm
        ->add('minLength', IntegerType::class, [
            'required' => false,
            'property_path' => 'validatorConfiguration[QuestionLengthValidator][minStringLength]',
            'label' => 'field_definition.ezpoll.min_length',
            'attr' => ['min' => 0],
        ])
}
```


Add an extra tag definition in `fieldtypes.yml` to tell the system that the `FormMapper` right now works also as `FieldDefinitionFormMapper`.
```yml
# AppBundle/Resources/config/fieldtypes.yml
services:
    ...
    AppBundle\eZ\Publish\FieldType\Poll\FormMapper:
        tags:
            ...
            - {name: ez.fieldFormMapper.definition, fieldType: ezpoll}

```


### Add Field definition edit view
```twig
{# AppBundle/Resources/views/platformui/content_type/edit/ezpoll.html.twig #}

{% block ezpoll_field_definition_edit %}
    <div class="ezpoll-validator answer_limit{% if group_class is not empty %} {{ group_class }}{% endif %}">
        {{- form_row(form.answerLimit) -}}
    </div>
{% endblock %}
```


Register the new template in the configuration by editing the `ez_field_templates.yml` file

```yml
# AppBundleResources/config/ez_field_templates.yml
system:
    admin_group:
        fielddefinition_edit_templates:
            - {template: AppBundle:platformui/content_type/edit:ezpoll.html.twig, priority: 0}
```


#### Implement `toStorageFieldDefinition()` and `toFieldDefinition()` methods in `LegacyConverter`
to make sure that validation data is properly saved into and retrieved from the database


`toStorageFieldDefinition()` converts a Field definition to a legacy one using the proper field, e.g. `dataText1`, `dataInt1`.


`toFieldDefinition()` converts a stored legacy Field definition to an API Field definition (which means converting it back to an array according to validation schema).


![GitHub Logo](/assets/img/we-get-it-done.jpeg)
