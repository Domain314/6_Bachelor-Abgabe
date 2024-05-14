% Load the CSV file
data =  readtable('./data/lighthouse_data4_impact.csv');

% Initialize arrays to hold CO2 values and their corresponding scores
xValues = [];
yValues = [];
allTechs = {};

% Iterate through each row in the data
for i = 1:height(data)
    % Split the technologies by comma for the current row and trim spaces
    techs = strtrim(strsplit(data.frameworks{i}, ','));
    % For each technology in the current row
    for j = 1:length(techs)
        tech = techs{j};
        % Append the CO2 and score values to the xValues and yValues arrays
        xValues = [xValues; data.CO2WithGreenHosting(i)];
        yValues = [yValues; data.score(i)];
        allTechs = [allTechs; {tech}];
    end
end

% Plot the scatter diagram
scatter(xValues, yValues, 'filled');

% Label the axes and title
xlabel('CO2 Emissionen');
ylabel('Lighthouse Score');
title('Streudiagram der CO2 Emissionen vs. Lighthouse Score');

% Improve plot aesthetics
grid on;  % Turn on the grid
ax = gca; % Get current axes
ax.XAxis.Exponent = 0; % Prevent scientific notation on x-axis
ax.YAxis.Exponent = 0; % Prevent scientific notation on y-axis

set(gca, 'XScale', 'log');

print -depsc scatterCO2vsScore.eps