data =  readtable('./data/lighthouse_data4_clean.csv');

% Initialize a map to hold the count for each technology
techCount = containers.Map('KeyType', 'char', 'ValueType', 'double');

% Iterate through each row in the data
for i = 1:height(data)
    % Split the technologies by comma for the current row and trim spaces
    techs = strtrim(strsplit(data.libraries{i}, ','));
    % For each technology in the current row
    for j = 1:length(techs)
        tech = techs{j};
        if isKey(techCount, tech)
            % If the tech already exists, update the count
            techCount(tech) = techCount(tech) + 1;
        else
            % Otherwise, initialize the count for this tech
            techCount(tech) = 1;
        end
    end
end

% Extract the technology names and their respective counts
techNames = keys(techCount);
techCounts = zeros(length(techNames), 1);

% Accumulate the counts for each technology
for i = 1:length(techNames)
    techCounts(i) = techCount(techNames{i});
end

% Sort the technologies and counts in ascending order by counts
[sortedCounts, sortIndex] = sort(techCounts, 'descend');
sortedNames = techNames(sortIndex);

% Construct xLabels with name and count for each technology
xLabels = cell(length(sortedNames), 1); % Initialize cell array for labels
for i = 1:length(sortedNames)
    xLabels{i} = sprintf('%s (%d)', sortedNames{i}, sortedCounts(i));
end

% Plotting the bar diagram
bar(sortedCounts)
set(gca, 'XTick', 1:length(sortedCounts), 'XTickLabel', xLabels, 'XTickLabelRotation', 45);
ylabel('Occurrences');
xlabel('Frameworks/Libraries');
%pie(techCounts, 'LabelStyle', 'namedata', 'LegendVisible', 'on', 'StartAngle', -0);
title('Verwendung von Frontend Libraries und Frameworks');
%legend(techNames);
%colors = ["#bc6d5c", "#bc9d5c", "#abbc5c", "#6d5cbc", "#5cbc6d", "#7bbc5c", "#bc5cab", "#5cabbc"];
%colororder(colors);

print -depsc barLibraries.eps