# Music Manager

## Problem

If you are a passionate music collector that has been collecting for a long time, you may have trouble remembering which albums you have in your collection. This applications aims to solve that problem!

## Main Users

The main users are people collecting music as a hobby or just anyone that would like to organize and have an easy overview of their albums. The application will have a simple UI that anyone will be able to use.

## Features

- Add albums
- Edit albums
- List albums
- Remove albums
- Search for a specific album
- Filter search results

## Logical Model

![Logical model](/diagrams/logical-model.png)

Since a track cannot be found using only the given attributes it's modeled as a weak entity set. This is also the case for the producer. Both of these entity sets are dependent on the specific album that they are present on.

The reason for not including the producer and track attribues in the entity set **Albums** is to minimize redundancy. If we have multiple producers for an album the tuple would be duplicated and the only difference would be the producer. The same problem occures if the track attributes were included.

The relationship between **Albums** and **Tracks** is _many-many_ since an album can include any numner of tracks and a specific track can be present on multiple albums. Between **Albums** and **Producers** the relation is also _many-many_ since a producer can produce many albums and a album can have multiple producers.

## SQL Design

Albums(label, device, genre, title, band, year, id)

Tracks(name, length, albumId)

Producers(name, albumId)

I did not convert the relations to tables since this would cause redundancy. This is because they are a part of the weak entity sets **Producers** and **Tracks**. I did rename some of the attributes just to make it a bit clearer when combining attributes from different entities.

## SQL Queries

**Search for an album by title or band**

```sql
SELECT title FROM Albums WHERE title LIKE 'query%' OR band LIKE 'query%'
```

The query will return rows where part of the the album title or band matches.

**Sort albums by length**

```sql
SELECT title FROM Albums, Tracks GROUP BY title ORDER BY SUM(length)
```

Will be used when we want to list the albums by length. This query uses two tables and the values are grouped by title. Album title and length will be selected since that's the values that will be displayed in the application.

**Get the length of an album**

```sql
SELECT SUM(length) FROM Tracks WHERE albumId = 'x'
```

Used when displaying an individual albums length.

**Filter albums by producer and label**

```sql
SELECT title FROM Albums WHERE label = 'x' INNER JOIN Producers ON Producers.albumId = id
```

This query will be used as a part of the filter function when searching for albums.

**Get all information about a specific album**

```sql
SELECT * FROM Albums INNER JOIN Tracks ON Tracks.albumId = id INNER JOIN Producers ON Producers.albumId = id WHERE Albums.band = 'x' AND Albums.title = 'y'
```

This query will be used in conjunction with the query that returns the length of an album when displaying an album in detail.
