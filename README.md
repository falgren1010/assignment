# Setup

For this assignment the project is structured as a Monorepo. In a real environment
the OS and Portal would ofcourse be split in separate Repos.

## Prerequities
    
- Docker / Docker Desktop installed and running
- Terminal with cursor in project root folder "assignment"

### Backend datum-os setup
    cd datum-os  

    rename file env-template to .env or create .env file and copy values from env-template (the . is important)
    
    npm i 

    docker compose up -d 

    npm run db:generate

    npm run db:push

    npm run seed

    npm run dev

backend starts up locally and material data initialized in DB

afterward navigate back to project root "assignment" -> cd ..

### Frontend datum-portal setup

    cd datum-portal

    npm i

    npm run dev

backend starts up locally and material data initialised in DB



