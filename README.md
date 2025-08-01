# Ruleta

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11. This is a roulette where you can add a spin force, this project don't use a backend because all the data is given by an excel file.

### Admin route

The route for the admin is [admin route](http://localhost:4200/#/admin/dashboard) in this page you only upload the excel file and the system load the data.

> [!IMPORTANT]  
> The excel file has to have this format, the columns must have the same name:

| id  | item | descripcion  | urlImagen  | nombreParticipante |
| --- | ---- | ------------ | ---------- | ------------------ |
| 1   | PC   | this is a PC | http://... |                    |

> [!NOTE]  
> Any time in the admin route you can modify the data, the system decide if an item should be show in the roulette if don't have an nombreParticipante that's the reason this column could be empty.

### Participants route

Finally the route for the participants is [participants route](http://localhost:4200/#/participante/ruleta).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
