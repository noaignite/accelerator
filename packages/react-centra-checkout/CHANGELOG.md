# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.6](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@1.0.0-alpha.5...@noaignite/react-centra-checkout@1.0.0-alpha.6) (2023-03-14)

**Note:** Version bump only for package @noaignite/react-centra-checkout





# [1.0.0-alpha.5](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@1.0.0-alpha.4...@noaignite/react-centra-checkout@1.0.0-alpha.5) (2023-03-09)

**Note:** Version bump only for package @noaignite/react-centra-checkout





# [1.0.0-alpha.4](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@1.0.0-alpha.3...@noaignite/react-centra-checkout@1.0.0-alpha.4) (2023-03-09)

**Note:** Version bump only for package @noaignite/react-centra-checkout





# [1.0.0-alpha.3](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@1.0.0-alpha.2...@noaignite/react-centra-checkout@1.0.0-alpha.3) (2023-03-06)

**Note:** Version bump only for package @noaignite/react-centra-checkout





# [1.0.0-alpha.2](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@1.0.0-alpha.1...@noaignite/react-centra-checkout@1.0.0-alpha.2) (2023-03-03)


### Features

* **Context:** add possibility to pass a different api client ([9ab5405](https://github.com/noaignite/accelerator/commit/9ab540562b36261d600686ccf2e0a109f66da823))
* **Context:** make apiUrl and apiClient optional ([85f5166](https://github.com/noaignite/accelerator/commit/85f51661efc24a8cbbac7edd296b1abbca674f98))





# [1.0.0-alpha.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@1.0.0-alpha.0...@noaignite/react-centra-checkout@1.0.0-alpha.1) (2023-03-02)


### Bug Fixes

* **ApiClient:** make sure headers are not overwritten ([dc55792](https://github.com/noaignite/accelerator/commit/dc55792620aa061c315fc555a02df949aa584c61))


### Features

* update types ([0217ff9](https://github.com/noaignite/accelerator/commit/0217ff9263bc7c819ce86e9d663a8131640ac8b4))





# [0.16.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.15.1...@noaignite/react-centra-checkout@0.16.0) (2023-01-27)


### Features

* bump node engine to 14 ([72f5942](https://github.com/noaignite/accelerator/commit/72f594247b275a60b45890efc06d43c1241c6b24))


### BREAKING CHANGES

* Node 12 is no longer supported as it's no longer maintained





## [0.15.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.15.0...@noaignite/react-centra-checkout@0.15.1) (2022-11-08)


### Bug Fixes

* **context:** set tokenCookieOptions default value to null ([2b34675](https://github.com/noaignite/accelerator/commit/2b346759d6636eaed508cd99b5920394115bb159))





# [0.15.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.14.0...@noaignite/react-centra-checkout@0.15.0) (2022-11-04)


### Bug Fixes

* **context:** use CookieAttributes type ([cad68b8](https://github.com/noaignite/accelerator/commit/cad68b8cfb0dabed7a9539c29fcf1bb7b1f90e1a))


### Features

* **context:** add addBackInStockSubscription support ([6bf6577](https://github.com/noaignite/accelerator/commit/6bf65777768494b8666fa5ba1c546c2f569937c7))
* **context:** add addCustomGiftCertificate support ([e0a0a7c](https://github.com/noaignite/accelerator/commit/e0a0a7c37e7f4cf211d6dd5e16fb0850d851d2be))
* **context:** add support for customising cookie options ([8175634](https://github.com/noaignite/accelerator/commit/81756342d474c704ef7a61ba5897a95795805256))





# [0.14.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.13.2...@noaignite/react-centra-checkout@0.14.0) (2022-08-09)


### Bug Fixes

* **Context:** Make addGiftCertificate optional ([d62e582](https://github.com/noaignite/accelerator/commit/d62e582981cf420de1ac7484329fe19b8bd6208e))
* **Context:** Update addGiftCertificate response type ([ce74daa](https://github.com/noaignite/accelerator/commit/ce74daa235fc05e17f44ec461124a4f7580e68a8))


### Features

* **Context:** add method addBundleItem ([e79c1e9](https://github.com/noaignite/accelerator/commit/e79c1e99199ae75e5638a12e711da6382f4a50b1))
* **Context:** add method addGiftCertificate ([2125eb0](https://github.com/noaignite/accelerator/commit/2125eb075c86fc72daba4ce81eb4354d719504a3))





## [0.13.2](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.13.1...@noaignite/react-centra-checkout@0.13.2) (2022-06-21)


### Bug Fixes

* **PaymentEmbed:** run onPaymentError on first request also ([5455bfc](https://github.com/noaignite/accelerator/commit/5455bfc57e5541a4317ff968b146d215d839834a))





## [0.13.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.13.0...@noaignite/react-centra-checkout@0.13.1) (2022-06-21)


### Bug Fixes

* **PaymentEmbed:** pass along termsAndConditions in centra_checkout_payment_callback ([32e5783](https://github.com/noaignite/accelerator/commit/32e57834c8da97f4613b93bc6503e0e2bcd636cb))





# [0.13.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.12.2...@noaignite/react-centra-checkout@0.13.0) (2022-06-14)


### Features

* add CentraEvents ([7bff48d](https://github.com/noaignite/accelerator/commit/7bff48db0a7925f07b11fe50a553d9d5957a46de))





## [0.12.2](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.12.1...@noaignite/react-centra-checkout@0.12.2) (2022-06-11)

**Note:** Version bump only for package @noaignite/react-centra-checkout





## [0.12.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.12.0...@noaignite/react-centra-checkout@0.12.1) (2022-06-09)


### Bug Fixes

* **PaymentEmbed:** don't re-render causing unneccessary posts to payment ([cdb6073](https://github.com/noaignite/accelerator/commit/cdb607340c7d9104d27c5c228ca35324933b7381))





# [0.12.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.11.0...@noaignite/react-centra-checkout@0.12.0) (2022-06-08)


### Bug Fixes

* **PaymentEmbed:** make sure PaymentEmbed works properly ([3757aa9](https://github.com/noaignite/accelerator/commit/3757aa96af738358faca39af73558a59146b8caa))


### Features

* **PaymentEmbed:** add support for handling 'centra_checkout_payment_callback' ([bce1cf7](https://github.com/noaignite/accelerator/commit/bce1cf7d63ee71086ae5b6883ad9a43cb0d800a6))





# [0.11.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.10.1...@noaignite/react-centra-checkout@0.11.0) (2022-06-01)


### Features

* add ShipwalletEmbed ([4769b10](https://github.com/noaignite/accelerator/commit/4769b105e297251223791e7d70462faaae9084b1))





## [0.10.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.10.0...@noaignite/react-centra-checkout@0.10.1) (2022-05-09)


### Bug Fixes

* tsconfig namespace issue ([d9c1c95](https://github.com/noaignite/accelerator/commit/d9c1c95ed79f363ec01fd0af7b67941d063e404f))





# [0.10.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.9.0...@noaignite/react-centra-checkout@0.10.0) (2022-05-02)


### Features

* **ApiClient:** add fetch options ([424313b](https://github.com/noaignite/accelerator/commit/424313b428f52431004819ce37f28358496efeb9))





# [0.9.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.8.0...@noaignite/react-centra-checkout@0.9.0) (2022-04-28)


### Features

* **Context:** use cookie instead of localStorage for session token ([9d4a9a2](https://github.com/noaignite/accelerator/commit/9d4a9a28395103b0810539fab02c93be81b9050b))





# [0.8.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.6.0...@noaignite/react-centra-checkout@0.8.0) (2022-03-22)


### Features

* **CentraContext:** add 'resetSelection' method ([7047ec6](https://github.com/noaignite/accelerator/commit/7047ec6b2a6eba96df9d6156bcccd89b8fa80a1a))





# [0.7.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.6.0...@noaignite/react-centra-checkout@0.7.0) (2022-03-16)


### Features

* **CentraContext:** add 'resetSelection' method ([7047ec6](https://github.com/noaignite/accelerator/commit/7047ec6b2a6eba96df9d6156bcccd89b8fa80a1a))





# [0.6.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.4.0...@noaignite/react-centra-checkout@0.6.0) (2022-03-10)


### Bug Fixes

* **PaymentEmbed:** add 'termsAndConditions' prop ([3cfe447](https://github.com/noaignite/accelerator/commit/3cfe447e3a56d534db0ee0de0d165bc70a1cef2a))


### Features

* **Context:** add updatePaymentFields method ([cbe94b8](https://github.com/noaignite/accelerator/commit/cbe94b8e0f0906ed7f615ea1bb94c1b7acc133a6))
* **PaymentEmbed:** add optional 'additionalPaymentProps' & remove unused props ([a1272ed](https://github.com/noaignite/accelerator/commit/a1272eda376748a411fb7a2aebc262f9e1c2fb8b))





# [0.5.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.4.0...@noaignite/react-centra-checkout@0.5.0) (2022-03-08)


### Features

* **Context:** add updatePaymentFields method ([cbe94b8](https://github.com/noaignite/accelerator/commit/cbe94b8e0f0906ed7f615ea1bb94c1b7acc133a6))





# [0.4.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.3.0...@noaignite/react-centra-checkout@0.4.0) (2022-03-07)


### Bug Fixes

* fix request method in 'useCentraOrders' ([f5c277c](https://github.com/noaignite/accelerator/commit/f5c277cb3a68c71516cc926d429cde8d5a7d98f2))


### Features

* **CentraContext:** add non-null default values where necessary ([119c42d](https://github.com/noaignite/accelerator/commit/119c42d88700fbc1c912b9527fe45dc57b65bee1))





## [0.3.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.3.0...@noaignite/react-centra-checkout@0.3.1) (2022-02-28)


### Bug Fixes

* fix request method in 'useCentraOrders' ([f5c277c](https://github.com/noaignite/accelerator/commit/f5c277cb3a68c71516cc926d429cde8d5a7d98f2))





# [0.3.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.2.1...@noaignite/react-centra-checkout@0.3.0) (2022-02-17)


### Features

* **Context:** add updateCampaignSite handler ([2183cea](https://github.com/noaignite/accelerator/commit/2183cea5a63330d4dc65543b4455f92388522290))





## [0.2.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.2.0...@noaignite/react-centra-checkout@0.2.1) (2022-02-15)


### Bug Fixes

* **Context:** update addNewsletterSubscription parameters ([4deede8](https://github.com/noaignite/accelerator/commit/4deede8d052ebac7643ea1eb82e43e31e403d961))





# [0.2.0](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.1.3...@noaignite/react-centra-checkout@0.2.0) (2022-02-15)


### Bug Fixes

* fix typo in 'resetCustomerPasword' ([828a4ff](https://github.com/noaignite/accelerator/commit/828a4ffa843448b9d0d54302a7a2c47d588b2409))


### Features

* **CentraProvider:** add 'updateCustomer' method ([7eb1c44](https://github.com/noaignite/accelerator/commit/7eb1c446471bd98a469f499c614264383de68ae0))





## [0.1.3](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.1.2...@noaignite/react-centra-checkout@0.1.3) (2022-02-01)


### Bug Fixes

* **CentraProvider:** restore previous selection if present ([0219e3c](https://github.com/noaignite/accelerator/commit/0219e3ce5f70adebe92fde0c49fef2c648cb2619))





## [0.1.2](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.1.1...@noaignite/react-centra-checkout@0.1.2) (2022-01-26)


### Bug Fixes

* add missing typescript dependency ([197be41](https://github.com/noaignite/accelerator/commit/197be413a5c57d1e77ce7671cc478ef02351d2ec))





## [0.1.1](https://github.com/noaignite/accelerator/compare/@noaignite/react-centra-checkout@0.1.0...@noaignite/react-centra-checkout@0.1.1) (2022-01-24)

**Note:** Version bump only for package @noaignite/react-centra-checkout





# 0.1.0 (2022-01-24)


### Features

* add customer endpoints ([0f620a1](https://github.com/noaignite/accelerator/commit/0f620a1d160dbe2b308f718a47baa870f8d3b046))
* add PaymentForm ([66bcbce](https://github.com/noaignite/accelerator/commit/66bcbce5696da4e394f0447510ce0a397e89eafc))
* add useCentraOrders hook ([4f75d4d](https://github.com/noaignite/accelerator/commit/4f75d4d0932b19fcefc00342b61f88b432d5c356))
* don't export Context as default ([80ddba4](https://github.com/noaignite/accelerator/commit/80ddba4af5f3fffb9f7ecc3bd7e7be4a28541fd2))
* export initial selection value ([655aa34](https://github.com/noaignite/accelerator/commit/655aa34b7c0122c5cd2e56787817186dc679cc92))
* move centra types into separate package ([3d8fe45](https://github.com/noaignite/accelerator/commit/3d8fe458d964ffe0c0fb72d9430a89c094f90361))
