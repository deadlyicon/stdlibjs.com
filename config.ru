require File.expand_path('../server', __FILE__)

map Server.assets_prefix do
  run Server.assets
end

run Server.new
