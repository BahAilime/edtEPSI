# EPSI Schedule Extractor

This project allows you to extract your schedule for a given week from the EPSI school website. The website might not be the best, but this tool helps you grab the schedule data you need without hassle.

## Features

- Extracts your weekly schedule from the EPSI website.
- Credentials can be provided either through the `.env` file or via command-line arguments.
- Specify the week by providing a date, and the tool will retrieve the events for that week.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bahailime/edtepsi.git
   cd edtepsi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment:
   - Create a `.env` file in the root directory and add your EPSI credentials:
     ```bash
     USERNAME=your_epsiname.familyname
     PASSWORD=your_password
     ```
   - Or pass the credentials via command-line arguments when running the script (see below).

## Usage

You can run the script using Node.js with optional command-line arguments.

### Arguments (all optional):

- `--date=[DD/MM/YYYY]` : Day in the week you want to get the schedule for. If not provided, the current week is used.
- `--username` : Your EPSI username (e.g., name.family).
- `--password` : Your EPSI password.

### Example:

```bash
node index.js --date=25/09/2024 --username=john.doe --password=your_password
```

If you set your credentials in the `.env` file, the command would look like this:

```bash
node index.js --date=25/09/2024
```

## License

This project is licensed under the MIT License.