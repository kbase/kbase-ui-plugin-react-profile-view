echo "Running plugin post install script"
cd react-app && \
npm install && \
echo "✓ dependencies installed successfully" && \
npm run build && \
echo "✓ built successfully" && \
echo "SKIPPING TESTS" && \
cd .. && \
npm run install-plugin && \
echo "✓ plugin setup successfully" && \
echo "✓ plugin installed successfully"
