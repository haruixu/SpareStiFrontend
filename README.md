<p align="center">
    <a href="https://gitlab.stud.idi.ntnu.no/idatt2106-gruppe-2/idatt2106_2024_02_backend" target="_blank">
        <img width="50%" src="https://media.discordapp.net/attachments/1229758481150640209/1235586776824021103/avatar1.png?ex=6635921b&is=6634409b&hm=8818fe5e10a69e6df7b9da102e5fb65dcdbd962b2614d392be2578d6542822c4&=&format=webp&quality=lossless&width=1135&height=1137">
    </a>
    </p>
<h1 align="center">
            Sparesti frontend   
</h1>



## 🚀Getting started


### Requirements

To run the application you need the following installed:

- Vue
- Make
- Docker
- Git

### ⚙️Setup

#### The application can be run with one command in the following [Joint-Repository](https://gitlab.stud.idi.ntnu.no/idatt2106-gruppe-2/idatt2106_2024_02)

#### If you want to run the frontend independently, follow these instructions:

1. Clone the repository

```
git clone git@gitlab.stud.idi.ntnu.no:idatt2106-gruppe-2/idatt2106_2024_02_frontend.git
```

2. Navigate to project root folder
```
cd idatt2106_2024_02_frontend
```


### 🚗Running the application

1. Run the application (NOTE: make sure Docker is running)
```
make run
```

The application is now running on localhost

NOTE: if you don't have make installed, use the following command instead:

```
docker compose up
```

##### Exiting the application
To exit the application, use CTRL + C.

### 🧪 Test data
The database is populated with a pre-configured user at runtime which 
can be used to experiment with the application. You can log in with the following credentials:
- Username: ```username```
- Password: ```Test123!```

### 📋 Running tests
You can run unit and integration tests with: 
```
make test
```