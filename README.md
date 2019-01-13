# Music Manager

## 1. Idea

If you are a passionate music collector that has been collecting for a long time, you may have trouble remembering which albums you have in your collection. This application aims to solve that problem!

The main users are people collecting music as a hobby or just anyone that would like to organize and have an easy overview of their albums. The application will have a simple UI that anyone will be able to use. With a search feature and sort functionality, users will be able to quickly find specific albums.

The application will have the following features:

- Add albums
- Edit albums
- List albums
- View Specific album
- Remove albums
- Search for albums
- Sort albums

## 2. Logical model

![Logical model](https://raw.githubusercontent.com/rasfa98/music-manager/master/diagrams/logical-model.png)

Since an album cannot be found using only the given attributes I gave it an ID just to avoid using weak entity sets. This is also the case for the tracks and producers.

The reason for not including the producer and track attribues in the entity set **Albums** was to minimize redundancy. If we have multiple producers for an album the tuple would be duplicated and the only difference would be the producer. The same problem occures if the track attributes were included. I reasoned that an album can only have a single title, band, genre, year and label so that's why they are included in the entity set. I found it okay to duplicate the tuples if the same album exists on multiple devices since I think it's required.

The relationship between **Albums** and **Tracks** is _many-many_ since an album can include any number of tracks and a specific track can be present on multiple albums (collection of best songs etc.). Between **Albums** and **Producers** the relation is also _many-many_ since a producer can produce many albums and an album can have multiple producers.

## 3. Design in SQL

```sql
Albums(
    label CHAR,
    device CHAR,
    genre CHAR,
    albumTitle TEXT,
    band CHAR,
    year INT(4),
    albumId CHAR PRIMARY KEY)

ProducedBy(
    albumId CHAR,
    producerId CHAR PRIMARY KEY)

MadeOf(
    albumId CHAR,
    trackId CHAR PRIMARY KEY)

Tracks(
    trackName TEXT,
    trackLength INT,
    trackId CHAR PRIMARY KEY)

Producers(
    producerName CHAR,
    producerId CHAR PRIMARY KEY)
```

I converted the relationships into tables to minimize rendundancy and to remove anomalies, this is because the relationships are _many-many_. I renamed some of the attributes in order to make it easier to understand when joining tables. Every table has a primary key, which will be the album/track or producer ID. For almost every column the type is _CHAR_, the reason for this is that this type has a max length of 20 characters which I found to be enough. This removes the need for constraints regarding the length. The year has a length constraint of 4 numbers since that's the format that is required. For the other fileds where _CHAR_ is not enough, the _TEXT_ type is used instead.

## 4. SQL queries

**Search albums by title or band**

```sql
SELECT albumId,
       albumTitle,
       band
FROM Albums
WHERE albumTitle LIKE 'x%'
  OR band LIKE 'x%'
```

This query will be used when searching for an album. I'm using the _LIKE_ operator in order to get the tuples where the album title or band starts with the given query. I'm only selecting the columns that will be used.

**Sort albums by length**

```sql
SELECT Albums.albumId,
       albumTitle,
       band
FROM Albums,
     MadeOf
INNER JOIN Tracks ON MadeOf.trackId = Tracks.trackId
AND MadeOf.albumId = Albums.albumId
GROUP BY Albums.albumId
ORDER BY SUM(trackLength) DESC
```

This query will be used when sorting the added albums on the index page. This is a multirelational query that orders the albums by length in descending order. I'm grouping the results by ID and using the aggregate function _SUM_ to calculate the length of an album, by adding the length of all tracks.

**Sort albums by most tracks**

```sql
SELECT Albums.albumId,
       albumTitle,
       band
FROM Albums
INNER JOIN MadeOf ON MadeOf.albumId = Albums.albumId
GROUP BY Albums.albumId
ORDER BY COUNT(MadeOf.trackId) DESC
```

This query will be used when sorting the added albums on the index page. This is a multirelational query that orders the albums by the number of tracks in descending order. I'm grouping the results by ID and using the aggregate function _COUNT_ to calculate the number of tracks.

**Remove all producers of an album**

```sql
DELETE
FROM Producers
WHERE producerId IN
    (SELECT producerId
     FROM ProducedBy
     WHERE albumId = 'x')
```

This query will be used when removing an album. This will remove all producers that are connected to a specific album. The reason for using a WHERE clause instead of _INNER JOIN_ was because joins are not supported in **SQLite** delete statements.

**Get all information about a speific album**

```sql
SELECT Albums.albumId,
       albumTitle,
       band,
       genre,
       year,
       label,
       device,
       GROUP_CONCAT(DISTINCT producerName) AS producers,
       GROUP_CONCAT(DISTINCT trackName) AS trackNames,
       GROUP_CONCAT(DISTINCT trackLength) AS trackLengths,
       COUNT(DISTINCT trackName) AS numberOfTracks,
       SUM(DISTINCT trackLength) AS albumLength
FROM Albums,
     ProducedBy,
     MadeOf
INNER JOIN Producers ON Producers.producerId = ProducedBy.producerId
INNER JOIN Tracks ON Tracks.trackId = MadeOf.trackId
WHERE Albums.albumId = 'x'
  AND ProducedBy.albumId = 'x'
  AND MadeOf.albumId = 'x'
```

This query will be used to get the details about a specific album. It will be used when viewing an album as well as editing an existing one. This is a multirelational query that uses all tables in the database to combine the data from **Albums**, **Tracks** and **Producers**. I'm using the aggregate function _GROUP_CONCAT_ to join columns with the same name which makes it possible to return all data in a single query. All producers, track names and lengths are concatenated into strings. I'm also adding some aggregate functions in order to return the number of tracks together with the length of the album. The reason for getting all data in a single query, was to remove the use of a transaction. It also makes the code a bit cleaner.

## 5. Implementation

Link to source code: https://github.com/rasfa98/music-manager

If you want to run the application you need to clone the project and create file in the root directory called **.env** with the following structure:

```bash
PORT=8080
DB_NAME=music-manager
SESSION_SECRET=XXXX
```

Then do the following to start the application

1. Open your terminal and go to the root directory of the project
2. Install the required packages `$ npm install`
3. Start the application `$ npm start`
4. The application should now run on http://localhost:8080

## 6. Supplemental video

Link to video: https://www.youtube.com/watch?v=90DmQrYNl0E

_Rasmus Falk, WP17_
