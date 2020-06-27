require 'fileutils'
require './services'

$kbase_env = ENV['KBASE_ENV']
$kbase_token = ENV['KBASE_TOKEN']

# object_limit = ENV['OBJECT_LIMIT']
# if object_limit != nil
#     object_limit = object_limit.to_i
# end
# puts "ObjectLimit: #{object_limit}"

# indexer = RefdataIndexer.new
# indexer.index_workspace_objects object_limit: object_limit



def main()
    puts "Fetching profiles for #{$kbase_env}..."
    # make data dir, if doesn't exist.
    dataDir = "./_temp/#{$kbase_env}"
    FileUtils.mkdir_p dataDir
    
    # TODO: if does exist and has files, bail.

    client = UserProfile.new $kbase_env, $kbase_token
    profiles = client.filter_users({filter: ''})
    puts "Hey, got #{profiles.length} users"
    profileCount = profiles.length
    profiles.each.with_index do |user, index| 
        completed = 100.0 * index / profileCount
        printf("%0.4g\r", completed)
        username = user['username']
        # if username != 'eapearson'
        #     next
        # end
        # puts "Fetching profile for #{username}"
        user_profiles = client.get_user_profile([username])

        user_profile = user_profiles[0]

        File.write "#{dataDir}/#{username}.json", JSON.dump(user_profile)
    end
end

main

# puts client.get_user_profile ['eapearson']