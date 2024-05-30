# SportNavigator (Work in Progress)

**Note: This README.md file is a work in progress and may be subject to changes.**

SportNavigator_ is a web application designed to help sports enthusiasts navigate and discover sports courts, teammates, and events. It provides an intuitive interface to explore various sports categories, view detailed information about events, and keep track of favorite places to play.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Usage](#usage)

    
## Features
- **Discover new sports courts**: View detailed information about sports courts.
- **Event Discovery**: Browse upcoming and past sports events.
- **Add courts**: Add new places that no one knows about.
- **Create events**: Create new events to find a team and teammates.
- **Favorites**: Keep track of your favorite field to play.
- **Search Functionality**: Easily search for events, teams, and players.          


## Architecture

### UML Diagram

```mermaid
classDiagram
  class User {
    bigint user_id
    varchar email
    varchar first_name
    varchar last_name
    timestamp date_of_created
  }
  class UserImage {
    bigint id
    bigint user_id
    oid bytes
    varchar mime
  }
  class UserFavoriteCourt {
    bigint user_id
    bigint sport_court_id
  }
  class Court {
    bigint id
    varchar name
    text description
    varchar sport
    varchar court_type
    timestamp date_of_creating
    bigint user_user_id
  }
  class CourtImage {
    bigint id
    bigint sport_court_id
    oid bytes
    varchar mime
  }
  class Coordinate {
    bigint id
    bigint court_id
    double latitude
    double longitude
  }
  class Event {
    bigint id
    varchar name
    text description
    timestamp event_time
    timestamp created_at
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
  UserFavoriteCourt "0..*" --> "1" Court : favorites<br>
  


  

