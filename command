require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
    {
        name: 'gstats-bw',
        description: 'Shows the guild stats.',
        options: [
            {
                name: 'interval',
                description: 'The interval of stats (Weekly, Monthly, Yearly, Total)',
                type: 3,
                required: false,
                choices: [
                    { name: 'Weekly', value: 'weekly' },
                    { name: 'Monthly', value: 'monthly' },
                    { name: 'Yearly', value: 'yearly' },
                    { name: 'Total', value: 'total' }
                ]
            },
            {
                name: 'mode',
                description: 'The mode of stats (Solo, Doubles, Triples, Quads, All Modes)',
                type: 3,
                required: false,
                choices: [
                    { name: 'Solo', value: 'SOLO' },
                    { name: 'Doubles', value: 'DOUBLES' },
                    { name: 'Triples', value: 'TRIPLES' },
                    { name: 'Quads', value: 'QUAD' },
                    { name: 'All Modes', value: 'ALL_MODES' }
                ]
            }
        ]
    },
    {
        name: 'gstats-sw',
        description: 'Shows the SkyWars guild stats.',
        options: [
            {
                name: 'interval',
                description: 'The interval of stats (Weekly, Monthly, Yearly, Total)',
                type: 3,
                required: false,
                choices: [
                    { name: 'Weekly', value: 'weekly' },
                    { name: 'Monthly', value: 'monthly' },
                    { name: 'Yearly', value: 'yearly' },
                    { name: 'Total', value: 'total' }
                ]
            },
            {
                name: 'mode',
                description: 'The mode of stats (Solo, Doubles, All Modes)',
                type: 3,
                required: false,
                choices: [
                    { name: 'Solo', value: 'SOLO' },
                    { name: 'Doubles', value: 'DOUBLES' },
                    { name: 'All Modes', value: 'ALL_MODES' }
                ]
            }
        ]
    },
    {
        name: 'ginfo',
        description: 'Shows information about the guild.'
    },
    {
        name: 'get-stalked',
        description: 'Perform DDoX attack on PelyCooli.'
    },
    {
        name: 'sendmessage',
        description: 'Sends a message through the bot.',
        options: [
            {
                name: 'channel',
                description: 'The channel where you want to send the message.',
                type: 7,
                required: true,
            },
            {
                name: 'title',
                description: 'The title of the message.',
                type: 3,
                required: true,
            },
            {
                name: 'description',
                description: 'The description of the message.',
                type: 3,
                required: true,
            },
            {
                name: 'color',
                description: 'The color of the embed (hexadecimal value).',
                type: 3,
                required: false,
            },
        ],
    },
    {
        name: 'gclose',
        description: 'Close the guild application channel.',
        options: [
            {
                name: 'action',
                description: 'Action to perform',
                type: 3,
                required: true,
                choices: [
                    { name: 'Accept', value: 'accept' },
                    { name: 'Reject', value: 'reject' }
                ]
            }
        ]
    },
    {
        name: 'gjoinlog',
        description: 'Log when a member joins the guild.',
        options: [
            {
                name: 'username',
                description: 'The username of the member who joined the guild.',
                type: 3, // String type
                required: true,
            },
            {
                name: 'channel',
                description: 'The channel to log the join event.',
                type: 7, // Channel type
                required: true,
            }
        ]
    },
    {
        name: 'gleavelog',
        description: 'Log when a member leaves the guild.',
        options: [
            {
                name: 'username',
                description: 'The username of the member who left the guild.',
                type: 3, // String type
                required: true,
            },
            {
                name: 'channel',
                description: 'The channel to log the leave event.',
                type: 7, // Channel type
                required: true,
            }
        ]
    },
    {
        name: 'gkicklog',
        description: 'Log when a member is kicked from the guild.',
        options: [
            {
                name: 'username',
                description: 'The username of the member who got kicked from the guild.',
                type: 3, // String type
                required: true,
            },
            {
                name: 'reason',
                description: 'The reason for kicking the member.',
                type: 3, // String type
                required: true,
            },
            {
                name: 'channel',
                description: 'The channel to log the kick event.',
                type: 7, // Channel type
                required: true,
            }
        ]
    },
    {
        name: 'report',
        description: 'Report a rule breaker.',
        options: [
            {
                name: 'rule_breaker',
                description: 'The username of the rule breaker.',
                type: 3, // String type
                required: true,
            },
            {
                name: 'rule',
                description: 'The broken rule.',
                type: 3, // String type
                required: true,
            },
            {
                name: 'gamemode',
                description: 'The gamemode where the rule was broken.',
                type: 3, // String type
                required: true,
            },
            {
                name: 'evidence',
                description: '[URL] Evidence of the rule being broken.',
                type: 3, // String type
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('Slash commands were registered successfully!');
    } catch (error) {
        console.error(`Error while registering slash commands: ${error}`);

        // Log more details if available
        if (error.data) {
            console.error('Error data:', error.data);
        }
    }
})();
