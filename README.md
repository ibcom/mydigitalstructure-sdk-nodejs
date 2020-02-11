mydigitalstructure SDK Node.js Example
======================================

Node.js example app using the mydigitalstucture npm module.

> https://npmjs.org/package/mydigitalstructure

> https://docs.mydigitalstructure.cloud/gettingstarted_nodejs

**mydigitalstructure module;**

Initialise:

`var mydigitalstructure = require('mydigitalstructure')`

Controller:
- mydigitalstructure.add({name:, note:, code:});
- mydigitalstructure.invoke(name, parameters for controller, data for controller);

<!-- end of the list -->

Data:
- mydigitalstructure.set({scope:, context:, name:, value:});
- mydigitalstructure.get({scope:, context:, name:});

<!-- end of the list -->

Cloud:
- mydigitalstructure.cloud.save({object:, data:, callback:});
- mydigitalstructure.cloud.retrieve({object:, data:, callback:});
- mydigitalstructure.cloud.invoke({object:, data:, callback:});

<!-- end of the list -->
