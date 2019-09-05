echo "Running plugin post install script"
cd react-app && \
yarn install --no-lockfile --cache-folder=".yarn-cache" && \
echo "✓ dependencies installed successfully" && \
yarn run build && \
yarn run install-plugin && \
echo "✓ plugin setup successfully" && \
echo "✓ plugin installed successfully"
