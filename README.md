<p align="center">
    <img src="https://img.shields.io/npm/dt/iftar.svg" style="display:inline-block;">
    <img src="https://img.shields.io/npm/v/iftar.svg" style="display:inline-block;">
    <img src="https://img.shields.io/badge/cli-iftar-blue.svg" style="display:inline-block;">
</p>

<p align="center">
    A fast and simple CLI tool for checking iftar and suhoor times in Turkish cities.
</p>

## Installation

```bash
npm install -g iftar
```

## Usage

### Interactive Mode

Run without arguments to select a city interactively:

```bash
iftar
```

```
? Select a city: Istanbul

🌙  IFTAR TIME INFO

📍  City:         Istanbul
📅  Date:         March 15, 2025 (Saturday)
🌙  Hijri:        15 Ramadan 1446

🌅  Suhoor:       05:32
🌆  Iftar:        18:24
⏱️   Duration:     12h 52m

⏳  5h 31m remaining!
```

### Direct City Input

```bash
iftar istanbul
```

### List All Cities

```bash
iftar list
```

```
📍  Available Cities:

  Adana          Adiyaman       Afyonkarahisar Agri
  Aksaray        Amasya         Ankara         Antalya
  ...
```

## Features

- **Interactive Selection**: Fuzzy search with autocomplete
- **81 Turkish Cities**: All provinces supported
- **Hijri Date**: Islamic calendar date display
- **Time Remaining**: Countdown to iftar
- **Fasting Duration**: Total fasting hours

## Autocomplete

The interactive mode supports fuzzy search:

```bash
$ iftar
? Select a city: ist
❯ Istanbul
```

```bash
$ iftar
? Select a city: ank
❯ Ankara
```

## Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `iftar`        | Interactive city picker  |
| `iftar <city>` | Get times for a city     |
| `iftar list`   | List all available cities|
| `iftar --help` | Show help                |

## Development

```bash
git clone https://github.com/eneserdogan/iftar.git
cd iftar
npm install
node index.js
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Version

See the [Releases](https://github.com/eneserdogan/iftar/releases) section for changelogs.

## License

GPL-3.0 - see [LICENSE](LICENSE) for details.