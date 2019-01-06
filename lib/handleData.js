const uniqid = require('uniqid');

module.exports.mapAlbumData = data => {
  return {
    $label: data.label.toLowerCase().trim(),
    $device: data.device.toLowerCase().trim(),
    $genre: data.genre.toLowerCase().trim(),
    $albumTitle: data.albumTitle.toLowerCase().trim(),
    $band: data.band.toLowerCase().trim(),
    $year: data.year,
    $albumId: uniqid()
  };
};

module.exports.mapTrackData = data => {
  const tracks = [];

  if (Array.isArray(data.trackName)) {
    data.trackName.forEach((trackName, i) => {
      tracks.push({
        $trackName: trackName.toLowerCase().trim(),
        $trackLength: data.trackLength[i].trim(),
        $trackId: uniqid()
      });
    });
  } else {
    tracks.push({
      $trackName: data.trackName.toLowerCase().trim(),
      $trackLength: data.trackLength.trim(),
      $trackId: uniqid()
    });
  }

  return tracks;
};

module.exports.mapProducerData = data => {
  const producers = [];

  data.producers.split(',').forEach(producer => {
    producers.push({
      $producerName: producer.toLowerCase().trim(),
      $producerId: uniqid()
    });
  });

  return producers;
};

module.exports.mapAllAlbumDetails = data => {
  const details = {
    album: null,
    tracks: []
  };

  details.album = data;

  data.trackNames = data.trackNames.split(',');
  data.trackLengths = data.trackLengths.split(',');
  details.album.producers = details.album.producers.split(',').join(', ');

  data.trackNames.forEach((trackName, i) => {
    details.tracks.push({
      trackName: trackName,
      trackLength: data.trackLengths[i]
    });
  });

  delete details.album.trackNames;
  delete details.album.trackLengths;

  return details;
};
