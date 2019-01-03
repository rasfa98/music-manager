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

Since a track cannot be found using only the given attributes it's modeled as a weak entity set. This is also the case for the producer. Both of these entity sets are dependent on the specific album that they are present on.

The reason for not including the producer and track attribues in the entity set **Albums** is to minimize redundancy. If we have multiple producers for an album the tuple would be duplicated and the only difference would be the producer. The same problem occures if the track attributes were included.

The relationship between **Albums** and **Tracks** is _many-many_ since an album can include any numner of tracks and a specific track can be present on multiple albums. Between **Albums** and **Producers** the relation is also _many-many_ since a producer can produce many albums and a album can have multiple producers.

## SQL Design

Albums(label, device, genre, title, band, year, id)

Tracks(name, length, trackNr, albumId)

Producers(name, albumId)

I did not convert the relations to tables since this would cause redundancy. This is because they are a part of the weak entity sets **Producers** and **Tracks**. I did rename some of the attributes just to make it a bit clearer when combining attributes from different entities.

## SQL Queries

**Search albums by title or band**

```sql
SELECT * FROM Albums WHERE title LIKE 'x%' OR band LIKE 'x%'
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
