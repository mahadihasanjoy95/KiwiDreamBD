# KiwiDreamBD

KiwiDreamBD is a self-service platform for Bangladeshi students planning higher studies and settlement in New Zealand.

This repository is a monorepo and will contain the full Phase 1 product surface, including:

- `backend/` - Spring Boot REST API
- `frontend/` - student-facing React app
- `admin-frontend/` - admin panel
- `mobile/` - Flutter app for later phases
- `docs/` - project documentation, schema, and contracts

## Status

This project is under active development. Phase 1 focuses on:

- auth and security
- budget planning
- move cost planning
- savings readiness
- checklist and NZ guidance modules

## Tech Stack

- Backend: Java 25, Spring Boot, Spring Security, JWT, OAuth2, JPA, MySQL
- Frontend: React, Zustand, Tailwind CSS, i18next
- Admin Frontend: React
- Mobile: Flutter (planned)

## Environment Variables

No real secrets are stored in this repository.

All sensitive configuration must be provided through environment variables.

## Branch Strategy

- `master` - stable branch
- `dev` - active development branch
- feature branches - `module_name_dev`

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

