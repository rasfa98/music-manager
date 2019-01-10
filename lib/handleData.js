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
      const newName = trackName
        .split(',')
        .map(x => x.trim())
        .map(x => x.toLowerCase())
        .join(', ');

      tracks.push({
        $trackName: newName,
        $trackLength: convertTrackLengthToSeconds(data.trackLength[i]),
        $trackId: uniqid()
      });
    });
  } else {
    const newName = data.trackName
      .split(',')
      .map(x => x.trim())
      .map(x => x.toLowerCase())
      .join(', ');

    tracks.push({
      $trackName: newName,
      $trackLength: convertTrackLengthToSeconds(data.trackLength),
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

  for (let i = 0; i < data.trackNames.length; i++) {
    if (data.trackNames[i].startsWith(' ') && i > 0) {
      data.trackNames[i - 1] += `,${data.trackNames[i]}`;

      data.trackNames.splice(i, 1);
    }
  }

  data.trackNames.forEach((trackName, i) => {
    details.tracks.push({
      trackName: trackName,
      trackLength: convertTrackLengthToMinutesAndSeconds(data.trackLengths[i]),
      trackNr: i + 1
    });
  });

  details.album.albumLength = convertTrackLengthToMinutesAndSeconds(
    details.album.albumLength
  );

  delete details.album.trackNames;
  delete details.album.trackLengths;

  return details;
};

function convertTrackLengthToSeconds(length) {
  const splitLength = length.split(':');

  let timeInSeconds = 0;

  timeInSeconds += parseInt(splitLength[0]) * 60;
  timeInSeconds += parseInt(splitLength[1]);

  return timeInSeconds;
}

function convertTrackLengthToMinutesAndSeconds(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return minutes + ':' + seconds;
}
