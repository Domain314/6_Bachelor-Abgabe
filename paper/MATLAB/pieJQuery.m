data =  readtable('./data/lighthouse_data4_full.csv');

% Initialize a map to hold the count for each major version of jQuery
jqueryVersionCount = containers.Map('KeyType', 'char', 'ValueType', 'double');

% Iterate through each row in the data
for i = 1:height(data)
    % Split the technologies by comma for the current row and trim spaces
    techs = strtrim(strsplit(data.libraries{i}, ','));
    % For each technology in the current row
    for j = 1:length(techs)
        tech = techs{j};
        
        % Check if the technology starts with 'jQuery'
        if startsWith(tech, 'jQuery')
            % Use a regular expression to extract major (and optionally minor) version numbers
            % This pattern extracts the major version
            versionPattern = '^jQuery\s+(\d+)';
            tokens = regexp(tech, versionPattern, 'tokens');
            if ~isempty(tokens)
                % Build the grouped version name (e.g., 'jQuery 3')
                majorVersion = tokens{1}{1};
                groupedVersionName = ['jQuery ', majorVersion];
                
                % Count the occurrences
                if isKey(jqueryVersionCount, groupedVersionName)
                    jqueryVersionCount(groupedVersionName) = jqueryVersionCount(groupedVersionName) + 1;
                else
                    jqueryVersionCount(groupedVersionName) = 1;
                end
            end
        end
        
    end
end

% Extract the technology names and their respective counts
techNames = keys(jqueryVersionCount);
techCounts = zeros(length(techNames), 1);

% Accumulate the counts for each technology
for i = 1:length(techNames)
    techCounts(i) = jqueryVersionCount(techNames{i});
end

% Plotting the pie chart
piechart(techCounts,techNames,LabelStyle="namepercent", LegendVisible="on", StartAngle="90");
%pie(techCounts, 'LabelStyle', 'namedata', 'LegendVisible', 'on', 'StartAngle', -0);
title('Verteilung der jQuery Versionen');
%legend(techNames);
%colors = ["#bc6d5c", "#bc9d5c", "#abbc5c", "#6d5cbc", "#5cbc6d", "#7bbc5c", "#bc5cab", "#5cabbc"];
%colororder(colors);

print -depsc pieJQuery.eps