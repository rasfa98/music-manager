# Music Manager

## Problem

If you are a passionate music collector that has been collecting for a long time, you may have trouble remembering which albums you have in your collection. This applications aims to solve that problem!

## Main Users

The main users are people collecting music as a hobby or just anyone that would like to organize and have an easy overview of their albums. The application will have a simple UI that anyone will be able to use.

## Features

- Add albums
- Edit albums
- List albums
- View Specific album
- Remove albums
- Search for albums
- Sort albums

## Logical Model

![Logical model](/diagrams/logical-model.png)

Since a track cannot be found using only the given attributes I gave it an ID just to avoid using weak entity sets. This is also the case for the producer.

The reason for not including the producer and track attribues in the entity set **Albums** is to minimize redundancy. If we have multiple producers for an album the tuple would be duplicated and the only difference would be the producer. The same problem occures if the track attributes were included. I reasoned that an album can only have a single band, genre and label so that's why they are included in the entity set. I found it okay to duplicate the tuples if the same album exists on multiple devices since I thnk it's required.

The relationship between **Albums** and **Tracks** is _many-many_ since an album can include any number of tracks and a specific track can be present on multiple albums (collection of best songs etc.). Between **Albums** and **Producers** the relation is also _many-many_ since a producer can produce many albums and a album can have multiple producers.

## SQL Design

Albums(label, device, genre, albumTitle, band, year, albumId)

Produces(albumId, producerId)

MadeOf(albumId, trackId)

Tracks(trackName, trackLength, trackNr, trackId)

Producers(producerName, producerId)

I did convert the relationships into tables in order to remove rendundancy, since the relationships are _many-many_.

## SQL Queries

**Search albums by title or band**

```sql
SELECT id, title, band FROM Albums WHERE title LIKE 'x%' OR band LIKE 'x%'
```

**Sort albums by length**

```sql
SELECT id, title, band FROM Albums INNER JOIN Tracks ON id = albumId GROUP BY albumId ORDER BY SUM(length) DESC
```

**Sort albums by most tracks**

```sql
SELECT id, title, band FROM Albums INNER JOIN Tracks ON id = albumId GROUP BY albumId ORDER BY COUNT(albumId) DESC
```

**Sort albums by most fewest tracks**

```sql
SELECT id, title, band FROM Albums INNER JOIN Tracks ON id = albumId GROUP BY albumId ORDER BY COUNT(albumId)
```

**Get all information about a speific album**

```sql
SELECT title,
       band,
       genre,
       year,
       label,
       device,
       GROUP_CONCAT(DISTINCT Producers.name) AS producers,
       GROUP_CONCAT(DISTINCT Tracks.name) AS trackNames,
       GROUP_CONCAT(DISTINCT length) AS trackLengths,
       GROUP_CONCAT(DISTINCT trackNr) AS trackNumbers,
       SELECT COUNT(DISTINCT trackNr) AS numberOfTracks,
       SUM(DISTINCT length) AS albumLength
FROM Albums
INNER JOIN Producers ON Producers.albumId = id
INNER JOIN Tracks ON Tracks.albumId = id
WHERE id = 'x'
```
