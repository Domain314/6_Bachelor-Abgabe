% Load the CSV file
data =  readtable('./data/lighthouse_data4_clean.csv');

% Initialize arrays to hold CO2 values and their corresponding technologies
allCO2Values = [];
allTechs = {};

% Iterate through each row in the data
for i = 1:height(data)
    % Split the technologies by comma for the current row and trim spaces
    techs = strtrim(strsplit(data.frameworks{i}, ','));
    % For each technology in the current row
    for j = 1:length(techs)
        tech = techs{j};
        % Append the CO2 value to the allCO2Values array and the technology name to the allTechs cell array
        allCO2Values = [allCO2Values; data.CO2WithGreenHosting(i)];
        allTechs = [allTechs; {tech}];
    end
end

% Calculate the frequency of each technology
[uniqueTechs, ~, idx] = unique(allTechs);
techCounts = accumarray(idx, 1);

% Sort the technologies by frequency in descending order
[~, sortIdx] = sort(techCounts, 'descend');
sortedTechs = uniqueTechs(sortIdx);

% Initialize new arrays for sorted values
sortedCO2Values = [];
sortedAllTechs = {};

% Populate the new arrays according to the sorted order of technologies
for i = 1:length(sortedTechs)
    tech = sortedTechs{i};
    techIndices = strcmp(allTechs, tech); % Find indices of all occurrences of this technology
    sortedCO2Values = [sortedCO2Values; allCO2Values(techIndices)];
    sortedAllTechs = [sortedAllTechs; allTechs(techIndices)];
end


% Now, plot the box plot using the sorted technologies
boxplot(sortedCO2Values, sortedAllTechs, 'LabelOrientation', 'inline', 'Whisker', 1.5);

% Now, plot the box plot
%boxplot(allCO2Values, allTechs, 'LabelOrientation', 'inline', 'Whisker', 1.5);
ylabel('CO2 Emissions');
xlabel('Frameworks/CMS');
title('Analyse der CO2 Emissionen unter Frameworks/CMS');
xtickangle(45);

% Set the y-axis to a logarithmic scale
set(gca, 'YScale', 'log');

% Adjust y-axis limits if necessary (optional)
 xlim([0, 50]);

print -depsc distCO2byFrameworksCMS.eps