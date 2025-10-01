# PDF Booklet Formatter

A single-page web application that reorders PDF pages for bifold booklet printing. Upload a PDF and get a reordered version optimized for printing as a booklet with 2 pages per sheet, double-sided, short edge binding.

## Features

- 🎯 **Pure Client-Side**: Runs 100% in the browser - no server required
- 📄 **PDF Processing**: Uses PDF-lib for client-side PDF manipulation
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🖨️ **Optimized for Printing**: Implements the correct page ordering algorithm for booklet printing
- 🎨 **Modern UI**: Clean, intuitive interface with drag-and-drop support
- 🔷 **TypeScript**: Written in TypeScript for better type safety and development experience
- 📦 **Bundled**: Uses Webpack for optimized production builds

## How It Works

The application implements a center-outward algorithm to reorder pages for optimal booklet printing:

- **4 pages**: 2,3,4,1
- **6 pages**: 4,5,6,3,2,blank,blank,1
- **8 pages**: 4,5,6,3,2,7,8,1
- **12 pages**: 6,7,8,5,4,9,10,3,2,11,12,1

The algorithm automatically pads to multiples of 4 pages (required for booklet printing) and adds blank pages as needed.

## Quick Start

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```
   This will start a development server at `http://localhost:8080` with hot reloading.

3. **Build for production**:
   ```bash
   npm run build
   ```
   This creates optimized files in the `dist/` folder ready for deployment.

### Usage

1. Open the application in your web browser
2. Upload a PDF file by clicking or dragging and dropping
3. The app will process the PDF and show the page ordering
4. Download the reordered PDF
5. Print with these settings:
   - **Pages per sheet**: 2
   - **Double-sided**: Yes
   - **Binding**: Short edge (flip on short edge)
6. Fold the printed sheets in half to create your booklet

## Project Structure

```
format-booklet/
├── src/
│   ├── main.ts             # Main TypeScript application logic
│   ├── styles.css          # CSS styling
│   └── index.html          # HTML template
├── dist/                   # Built files (created after npm run build)
├── webpack.config.js       # Webpack configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # NPM package configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Scripts

- `npm start` - Start development server with hot reloading
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run dev` - Build in development mode with watch
- `npm run serve` - Serve the built files from `dist/`
- `npm run clean` - Remove the `dist/` directory

## Technologies Used

- **TypeScript**: For type-safe development
- **HTML5**: Structure and file handling
- **CSS3**: Styling with modern features (Grid, Flexbox, CSS Variables)
- **PDF-lib**: Client-side PDF manipulation library
- **Webpack**: Module bundler and build tool
- **CSS Loader**: For importing CSS in TypeScript

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

The project uses TypeScript and Webpack for development and building:

### Development Server
```bash
npm start
```
Starts a development server with hot module replacement.

### Building
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder.

### File Structure
- Source files are in `src/`
- Built files go to `dist/`
- The main entry point is `src/main.ts`
- Styles are imported in TypeScript using `import './styles.css'`

## Algorithm Details

The page ordering algorithm works by:

1. Determining the total number of sheets needed (pages ÷ 4, rounded up)
2. Using a center-outward pattern starting from the middle pages
3. Each sheet contains 4 pages: 2 front pages and 2 back pages
4. Pages are arranged so that when printed double-sided and folded, they appear in the correct order

## Deployment

### **GitHub Pages (Automatic)**

This project is set up for automatic deployment to GitHub Pages:

1. **Push to main branch** - Any push to the `main` branch triggers automatic build and deployment
2. **Access your site** - Once deployed, visit: `https://jasonpstewart.github.io/format-booklet`
3. **Monitor builds** - Check the "Actions" tab in your GitHub repository to see build status

### **GitHub Pages Setup (One-time)**

To enable GitHub Pages for your repository:

1. Go to your repository settings on GitHub
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy on the next push to `main`

### **Manual Deployment**

For other static hosting services, build locally and deploy the `dist/` folder:

```bash
npm run build
# Upload the contents of dist/ folder to your hosting service
```

**Other hosting options:**
- **Netlify**: Connect repository with build command `npm run build` and publish directory `dist`
- **Vercel**: Connect repository for automatic deployments
- **Firebase Hosting**: Use Firebase CLI to deploy `dist/` folder
- **AWS S3**: Upload `dist/` contents and configure for static website hosting

## Type Safety

The project is written in TypeScript with strict type checking enabled. Key interfaces:

```typescript
interface Sheet {
    frontPages: (number | null)[];
    backPages: (number | null)[];
}

interface ProcessingElements {
    uploadArea: HTMLElement;
    fileInput: HTMLInputElement;
    // ... other DOM elements
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Make your changes
5. Test with: `npm start`
6. Build with: `npm run build`
7. Submit a pull request

## Troubleshooting

### Build Issues
- Ensure you have Node.js 16+ installed
- Run `npm install` to install all dependencies
- Check for TypeScript errors with detailed output

### PDF Won't Upload
- Ensure the file is a valid PDF
- Check that the file isn't corrupted
- Try a smaller PDF file

### Download Doesn't Work
- Check browser security settings
- Ensure popup blockers aren't interfering
- Try a different browser

### Printing Issues
- Verify printer settings match the instructions
- Check that your printer supports duplex printing
- Ensure "short edge binding" is selected

## License

MIT License - see the [LICENSE](LICENSE) file for details. Feel free to use and modify for your needs.
