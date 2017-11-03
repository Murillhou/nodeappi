## Synopsis

Node.js + express simple API.

## Code Example

Just fill the configuration files and run "node server.js"

## Motivation

This project is purely educational and its aim is to establish a set of JS coding good practics and style when writing an API with node and express. It is intended to be successively improved not only on better code style and organization but also with additional features.

The current API just exposes a few methods from some popular service and application interfaces.

## Installation

First of all, run "npm install".

Config files under "app" folder and "components/authentication" contains  configuration templates labeled _config.json. They need to be edited and filled up. When you are done editing them, delete the underscore from the files name for the configuration to take effect.

Some of the used services may need to be configured too. For doing that, each service associated folder (under app/services/ folder)  contains a configuration template too, which should be filled up to make the service work. 

## API Reference

Currently the API is self documented, as the root path "/" reponds to GET with a list of the available routes on the next level; currently POST "/authenticate" and POST/GET "/api". This last route also behave the same and the ones on the next levels.

## Tests

Just run "npm test"

## Contributors

Murillhou <murillhou@gmail.com>

## License

MIT