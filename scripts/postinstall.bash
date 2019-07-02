echo "Running plugin post install script"
cd ant-design-profile && \
npm install && \
echo "✓ dependencies installed successfully" && \
npm run build && \
echo "✓ built successfully" && \
npm run test -- --watchAll=false && \
echo "✓ tests run successfully" && \
npm run install-plugin && \
echo "✓ plugin setup successfully" && \
echo "✓ plugin installed successfully"