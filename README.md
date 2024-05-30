# SportNavigator

SportNavigator_ is a web application designed to help sports enthusiasts navigate and discover sports courts, teammates, and events. It provides an intuitive interface to explore various sports categories, view detailed information about events, and keep track of favorite place to play.

## Table of Contents
- [Features](#architecture)
- [Architecture](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
    
## Features
- **Discover new sports courts**: View detailed information about sports courts.
- **Event Discovery**: Browse upcoming and past sports events.
- **Add courts**: Add new places that no one knows about.
- **Create events**: Create new events to find team and teammates.
- **Favorites**: Keep track of your favorite field to play.
- **Search Functionality**: Easily search for events, teams, and players.

## Architecture
# UML Diagram

```mermaid
classDiagram
    class User {
        bigint user_id
        varchar(255) email
        varchar(30) first_name
        varchar(30) last_name
        timestamp(6) date_of_created
    }
    class UserImage {
        bigint id
        bigint user_id
        oid bytes
        varchar(255) mime
    }
    class UserFavoriteCourt {
        bigint user_id
        bigint sport_court_id
    }
    class Court {
        bigint id
        varchar(255) name
        text description
        varchar(32) sport
        varchar(255) court_type
        timestamp(6) date_of_creating
        bigint user_user_id
    }
    class CourtImage {
        bigint id
        bigint sport_court_id
        oid bytes
        varchar(255) mime
    }
    class Coordinate {
        bigint id
        bigint court_id
        double precision latitude
        double precision longitude
    }
    class Event {
        bigint id
        varchar(255) name
        text description
        timestamp(6) event_time
        timestamp(6) created_at
        bigint sport_court_id
        bigint user_user_id
    }
    class Review {
        bigint id
        text description
        integer rating
        bigint sport_court_id
        bigint user_user_id
    }

    User "1" --> "0..*" UserImage : has
    User "1" --> "0..*" UserFavoriteCourt : marks
    User "1" --> "0..*" Court : creates
    User "1" --> "0..*" Event : organizes
    User "1" --> "0..*" Review : writes
    Court "1" --> "0..*" CourtImage : includes
    Court "1" --> "0..*" Coordinate : located at
    Court "1" --> "0..*" Event : hosts
    Court "1" --> "0..*" Review : reviewed by
    UserFavoriteCourt "0..*" --> "1" Court : favorites
    

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)


