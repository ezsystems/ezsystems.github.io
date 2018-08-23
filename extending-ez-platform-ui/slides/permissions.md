## Custom permissions
### Roles, Policies and Limitations


A bundle can expose Policies via a `PolicyProvider` which can be added to `EzPublishCoreBundle`'s DIC extension.


### PollPolicyProvider
#### must implement `PolicyProviderInterface`


### Poll Policy configuration hash
```php
    [
        'poll' => [
            'list' => null,
            'show' => ['Question'],
        ],
    ];
```


### Integrating the `PolicyProvider` into `EzPublishCoreBundle`
```
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        // Retrieve "ezpublish" container extension.
        $eZExtension = $container->getExtension('ezpublish');

        // Add the policy provider.
        $eZExtension->addPolicyProvider(
            new PollPolicyProvider()
        );
    }
```
